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

// // Facebook strategy
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
        const email = profile.emails?.[0]?.value;
        // facebook account has email or phone

        if (!email) {
          return done(new Error("Email not provided by Google OAuth"));
        }

        let user = await prisma.user.findUnique({where: {email}, select: {id: true, status: true, role: true, isValidated: true}});

        if (user) {
          if (user.status === Status.BANNED) {
            return done(null, false);
          }
          if (!user.isValidated) {
            await prisma.user.update({where: {id: user.id}, data: {isValidated: true}});
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
                create: {name: profile.displayName || "Facebook User", avatar: profile.photos?.[0]?.value || null},
              },
            },
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Facebook OAuth Strategy Error:", err);
        return done(err as Error);
      }
    },
  ),
);
