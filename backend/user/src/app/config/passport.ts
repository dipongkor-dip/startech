import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as FacebookStrategy} from "passport-facebook";
import {PrismaClient, ProviderType, Status, UserRole} from "@prisma/client";
import {env} from "../env";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId!,
      clientSecret: env.googleClientSecret,
      callbackURL: `${process.env.API_URL || "http://localhost:5003"}/api/v1/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Email not provided by Google OAuth"));
        }

        let user = await prisma.user.findUnique({where: {email}, select: {id: true, status: true, role: true}});

        if (user) {
          if (user.status === Status.BANNED) {
            return done(null, false);
          }

          const existingProvider = await prisma.authProvider.findUnique({
            where: {
              provider_providerId: {
                provider: ProviderType.google,
                providerId: profile.id,
              },
            },
            select: {id: true},
          });

          if (!existingProvider)
            await prisma.authProvider.create({
              data: {
                userId: user.id,
                provider: ProviderType.google,
                providerId: profile.id,
              },
            });
        } else {
          // ৩. যদি একদম নতুন ইউজার হয়, তবে প্রিজমার nested write/create ব্যবহার করে এক ট্রানজেকশনে ইউজার, প্রোভাইডার এবং কাস্টমার প্রোফাইল তৈরি করব
          user = await prisma.user.create({
            data: {
              email: email,
              isValidated: true,
              role: UserRole.CUSTOMER,
              authProvider: {
                create: {
                  provider: ProviderType.google,
                  providerId: profile.id,
                },
              },
              customer: {
                create: {name: profile.displayName || "Google User", avatar: profile.photos?.[0]?.value || null},
              },
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    },
  ),
);

// Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: env.facebookAppId!,
      clientSecret: env.facebookAppSecret!,
      callbackURL: `${process.env.API_URL || "http://localhost:5003"}/api/v1/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        const facebookId = profile.id;
        const facebookName = profile.displayName || "Facebook User";
        const facebookAvatar = profile.photos?.[0]?.value || null;

        // 🎯 ১. প্রথমে চেক করব এই ফেসবুক আইডি দিয়ে অলরেডি কোনো প্রোভাইডার রেকর্ড আছে কিনা
        const existingProvider = await prisma.authProvider.findUnique({
          where: {
            provider_providerId: {
              provider: ProviderType.facebook, // 🟢 টাইপো ফিক্সড
              providerId: facebookId,
            },
          },
          select: {user: {select: {id: true, role: true, status: true, isValidated: true}}},
        });

        // 🎯 ২. যদি ফেসবুক অ্যাকাউন্ট অলরেডি আমাদের ডাটাবেসের কোনো ইউজারের সাথে লিংক করা থাকে
        if (existingProvider) {
          const linkedUser = existingProvider.user;

          if (linkedUser.status === Status.BANNED) return done(null, false);

          // যদি আগে ভেরিফাইড না থাকে, এখন ট্রু করে দিচ্ছি
          if (!linkedUser.isValidated) {
            await prisma.user.update({where: {id: linkedUser.id}, data: {isValidated: true}});
            linkedUser.isValidated = true;
          }

          // 🟢 ফিক্স: এখানেই কাজ শেষ, তাই এখান থেকেই ওঅথ সাকসেস রিটার্ন করছি
          return done(null, linkedUser);
        }

        // 🎯 ৩. যদি ফেসবুক প্রোভাইডার না থাকে, তখন ইমেইল দিয়ে কোনো ওল্ড ইউজার আছে কিনা চেক করব (যদি ইমেইল পাওয়া যায়)
        let user = null;
        if (email) {
          user = await prisma.user.findUnique({
            where: {email},
            select: {id: true, status: true, role: true, isValidated: true},
          });
        }

        if (user) {
          if (user.status === Status.BANNED) {
            return done(null, false);
          }

          if (!user.isValidated) {
            await prisma.user.update({where: {id: user.id}, data: {isValidated: true}});
            user.isValidated = true;
          }

          // ওল্ড ইউজারের সাথে নতুন ফেসবুক প্রোভাইডার অ্যাকাউন্টটি লিংক করে দেওয়া হচ্ছে
          await prisma.authProvider.create({
            data: {
              userId: user.id,
              provider: ProviderType.facebook, // 🟢 টাইপো ফিক্সড
              providerId: facebookId,
            },
          });
        }
        // 🎯 ৪. যদি ফেসবুক প্রোভাইডার বা ইমেইল—কোনোটা দিয়েই ইউজার না পাওয়া যায় (একদম নতুন কাস্টমার)
        else {
          user = await prisma.user.create({
            data: {
              email: email, // ইমেইল না থাকলে null বসবে, যা আপনার স্কিমা অনুযায়ী নিরাপদ
              isValidated: true,
              role: UserRole.CUSTOMER,
              authProvider: {
                create: {
                  provider: ProviderType.facebook, // 🟢 টাইপো ফিক্সড করে ফেসবুক করা হলো
                  providerId: facebookId,
                },
              },
              customer: {
                create: {
                  name: facebookName,
                  avatar: facebookAvatar,
                },
              },
            },
            select: {id: true, status: true, role: true},
          });
        }

        // 🎯 ৫. নতুন তৈরি হওয়া বা লিংক হওয়া ইউজার অবজেক্টটি পাসপোর্টে পাঠানো
        return done(null, user);
      } catch (err) {
        console.error("Facebook OAuth Strategy Error:", err);
        return done(err as Error);
      }
    },
  ),
);
