// import {Router, Request, Response, NextFunction} from "express";
// import passport from "passport";
// import bcrypt from "bcryptjs";
// import {PrismaClient} from "@prisma/client";
// import {signAccessToken, signRefreshToken, verifyToken} from "../utils/jwt";
// import { generateOtp, sendOtp } from "../utils/otp";

// const router = Router();
// const prisma = new PrismaClient();
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// function sanitizeUser(user: Record<string, unknown>) {
//   const {password, ...rest} = user;
//   return rest;
// }

// // POST /auth/register - email or phone + password
// router.post("/register", async (req: Request, res: Response) => {
//   try {
//     const {email, phone, password, profile, role} = req.body;
//     if (!password || (!email && !phone)) {
//       return res.status(400).json({error: "Email or phone and password required"});
//     }
//     const existing = await prisma.user.findFirst({
//       where: {
//         OR: [...(email ? [{email}] : []), ...(phone ? [{phone}] : [])],
//       },
//     });
//     if (existing) {
//       return res.status(400).json({error: "User already exists"});
//     }
//     const hash = await bcrypt.hash(password, 10);

//     const sanitizedProfile =
//       profile && typeof profile === "object"
//         ? {
//             name: (profile as any).name ?? undefined,
//             avatar: (profile as any).avatar ?? undefined,
//             address: (profile as any).address ?? undefined,
//           }
//         : undefined;

//     const finalRole =
//       role ?? (profile && typeof profile === "object" ? (profile as any).role : undefined) ?? "user";

//     const user = await prisma.user.create({
//       data: {
//         email: email || null,
//         phone: phone || null,
//         password: hash,
//         provider: "local",
//         isValidated: false,
//         role: finalRole,
//         profile: sanitizedProfile ? {create: sanitizedProfile} : undefined,
//       },
//       include: {profile: true},
//     });

//     const otp = generateOtp();
//     if (email) {
//       await sendOtp({ destinationType: "email", destination: email, otp });
//     }
//     if (phone) {
//       await sendOtp({ destinationType: "phone", destination: phone, otp });
//     }

//     const validatedUser = await prisma.user.update({
//       where: { id: user.id },
//       data: { isValidated: true },
//       include: { profile: true },
//     });

//     const accessToken = signAccessToken(validatedUser.id);
//     const refreshToken = signRefreshToken(validatedUser.id);
//     res.status(201).json({accessToken, refreshToken, user: sanitizeUser(validatedUser)});
//   } catch (error) {
//     res.status(400).json({error: "Registration failed"});
//   }
// });

// // POST /auth/login - email or phone + password (body: { login: "email@x.com"|"phone", password })
// router.post("/login", (req: Request, res: Response, next: NextFunction) => {
//   req.body.login = req.body.login ?? req.body.email ?? req.body.phone;
//   passport.authenticate("local", {session: false}, (err?: Error | null, user?: unknown) => {
//     if (err) return next(err);
//     if (!user) {
//       return res.status(401).json({error: "Invalid credentials"});
//     }
//     if ((user as any)?.isValidated === false) {
//       return res.status(403).json({ error: "Please verify your OTP first" });
//     }
//     const accessToken = signAccessToken((user as {id: string}).id);
//     const refreshToken = signRefreshToken((user as {id: string}).id);
//     res.json({accessToken, refreshToken, user: sanitizeUser(user as Record<string, unknown>)});
//   })(req, res, next);
// });

// // GET /auth/google - initiate Google OAuth
// router.get("/google", passport.authenticate("google", {scope: ["profile", "email"], session: false}));

// // GET /auth/google/callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {session: false, failureRedirect: `${FRONTEND_URL}/login?error=google`}),
//   (req: Request, res: Response) => {
//     const user = req.user as {id: string};
//     const accessToken = signAccessToken(user.id);
//     const refreshToken = signRefreshToken(user.id);
//     res.redirect(`${FRONTEND_URL}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
//   },
// );

// // GET /auth/facebook - initiate Facebook OAuth
// router.get("/facebook", passport.authenticate("facebook", {scope: ["email"], session: false}));

// // GET /auth/facebook/callback
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {session: false, failureRedirect: `${FRONTEND_URL}/login?error=facebook`}),
//   (req: Request, res: Response) => {
//     const user = req.user as {id: string};
//     const accessToken = signAccessToken(user.id);
//     const refreshToken = signRefreshToken(user.id);
//     res.redirect(`${FRONTEND_URL}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
//   },
// );

// // POST /auth/refresh - refresh tokens
// router.post("/refresh", async (req: Request, res: Response) => {
//   const refreshToken = req.body.refreshToken ?? req.cookies?.refreshToken;
//   if (!refreshToken) {
//     return res.status(401).json({error: "Refresh token required"});
//   }
//   const decoded = verifyToken(refreshToken);
//   if (!decoded || decoded.type !== "refresh") {
//     return res.status(401).json({error: "Invalid refresh token"});
//   }
//   const accessToken = signAccessToken(decoded.sub);
//   const newRefreshToken = signRefreshToken(decoded.sub);
//   res.json({accessToken, refreshToken: newRefreshToken});
// });

// // GET /auth/me - current user (JWT required)
// router.get("/me", passport.authenticate("jwt", {session: false}), (req: Request, res: Response) => {
//   res.json(sanitizeUser(req.user as Record<string, unknown>));
// });

// export default router;
