// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

// // Local strategy - email or phone + password
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'login',
//       passwordField: 'password',
//       passReqToCallback: true,
//     },
//     async (req, login, password, done) => {
//       try {
//         const user = await prisma.user.findFirst({
//           where: {
//             AND: [
//               { OR: [{ email: login }, { phone: login }] },
//               { OR: [{ provider: null }, { provider: 'local' }] },
//             ],
//           },
//           include: { profile: true },
//         });
//         if (!user || !user.password) {
//           return done(null, false, { message: 'Invalid credentials' });
//         }

//         if (!user.isValidated) {
//           return done(null, false, { message: 'Please verify your OTP first' });
//         }
//         const valid = await bcrypt.compare(password, user.password);
//         if (!valid) {
//           return done(null, false, { message: 'Invalid credentials' });
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err as Error);
//       }
//     }
//   )
// );

// // JWT strategy
// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//         (req: { cookies?: { accessToken?: string } }) => (req?.cookies?.accessToken ?? null) as string | null,
//       ]),
//       secretOrKey: JWT_SECRET,
//     },
//     async (payload, done) => {
//       try {
//         const user = await prisma.user.findUnique({
//           where: { id: payload.sub },
//           include: { profile: true },
//         });
//         if (user) return done(null, user);
//         return done(null, false);
//       } catch (err) {
//         return done(err as Error);
//       }
//     }
//   )
// );

// // Google strategy
// if (process.env.GOOGLE_CLIENT_ID) {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         callbackURL: `${process.env.API_URL || 'http://localhost:3003'}/auth/google/callback`,
//       },
//       async (_accessToken, _refreshToken, profile, done) => {
//         try {
//           const email = profile.emails?.[0]?.value;
//           let user = await prisma.user.findFirst({
//             where: {
//               OR: [
//                 { providerId: profile.id, provider: 'google' },
//                 ...(email ? [{ email }] : []),
//               ],
//             },
//             include: { profile: true },
//           });
//           if (!user) {
//             user = await prisma.user.create({
//               data: {
//                 email: email || undefined,
//                 provider: 'google',
//                 providerId: profile.id,
//                 isValidated: true,
//                 profile: {
//                   create: {
//                     name: profile.displayName || undefined,
//                     avatar: profile.photos?.[0]?.value,
//                   },
//                 },
//               },
//               include: { profile: true },
//             });
//           }
//           return done(null, user);
//         } catch (err) {
//           return done(err as Error);
//         }
//       }
//     )
//   );
// }

// // Facebook strategy
// if (process.env.FACEBOOK_APP_ID) {
//   passport.use(
//     new FacebookStrategy(
//       {
//         clientID: process.env.FACEBOOK_APP_ID!,
//         clientSecret: process.env.FACEBOOK_APP_SECRET!,
//         callbackURL: `${process.env.API_URL || 'http://localhost:3003'}/auth/facebook/callback`,
//         profileFields: ['id', 'displayName', 'emails', 'photos'],
//       },
//       async (_accessToken, _refreshToken, profile, done) => {
//         try {
//           const email = profile.emails?.[0]?.value;
//           let user = await prisma.user.findFirst({
//             where: {
//               OR: [
//                 { providerId: profile.id, provider: 'facebook' },
//                 ...(email ? [{ email }] : []),
//               ],
//             },
//             include: { profile: true },
//           });
//           if (!user) {
//             user = await prisma.user.create({
//               data: {
//                 email: email || undefined,
//                 provider: 'facebook',
//                 providerId: profile.id,
//                 isValidated: true,
//                 profile: {
//                   create: {
//                     name: profile.displayName || undefined,
//                     avatar: profile.photos?.[0]?.value,
//                   },
//                 },
//               },
//               include: { profile: true },
//             });
//           }
//           return done(null, user);
//         } catch (err) {
//           return done(err as Error);
//         }
//       }
//     )
//   );
// }
