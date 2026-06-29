import {Request, Response, Router} from "express";
import {authentication} from "../../middleware/authentication";
import {UserRole} from "@prisma/client";
import {authController} from "./auth.controller";
import {addEmployeeSchema, changePasswordSchema, loginSchema, registerSchema, sendOtpSchema, verifyOtpSchema} from "./auth.validation";
import {validateSchema} from "../../middleware/validateSchema";
import passport from "passport";
import {env} from "../../env";

const router = Router();

router.post("/register", validateSchema(registerSchema), authController.register);
router.post("/verify-otp", validateSchema(verifyOtpSchema), authController.verifyOtp);
router.post("/send-otp", validateSchema(sendOtpSchema), authController.sendOtp);
router.post("/login", validateSchema(loginSchema), authController.login);
router.post(
  "/change-password",
  validateSchema(changePasswordSchema),
  authentication(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SUPER_ADMIN, UserRole.DELIVERY_BOY, UserRole.CUSTOMER_SUPPORT_MANAGER, UserRole.PRODUCT_MANAGER),
  authController.changePassword,
);
router.get(
  "/me",
  authentication(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SUPER_ADMIN, UserRole.DELIVERY_BOY, UserRole.CUSTOMER_SUPPORT_MANAGER, UserRole.PRODUCT_MANAGER),
  authController.me,
);

router.post("/add-employee", authentication(UserRole.ADMIN, UserRole.SUPER_ADMIN), validateSchema(addEmployeeSchema), authController.addEmployee);

// GET /auth/google - initiate Google OAuth
router.get("/google", (req, res, next) => {
  const redirectTo = (req.query.state as string) || "/";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: redirectTo, // 🎯 টাইপস্ক্রিপ্ট এরর এড়াতে শেষে 'as any' দিন
  } as any)(req, res, next);
});

// GET /auth/google/callback
router.get("/google/callback", passport.authenticate("google", {session: false, failureRedirect: `${env.corsOrigin}/auth?error=google`}), authController.socialAuthCheck);

// GET /auth/google - initiate Google OAuth
// ❌ আগের ভুল কোড (যদি এভাবে থেকে থাকে):
// router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["profile", "email"] }));

// 🟢 সঠিক প্রফেশনাল কোড:
router.get("/facebook", (req, res, next) => {
  const redirectTo = (req.query.state as string) || "/";

  passport.authenticate("facebook", {
    scope: ["email", "public_profile"], // 🎯 নিশ্চিত করুন এখানে স্পেলিং সব ছোট হাতের অক্ষরে আছে
    session: false,
    state: redirectTo,
  } as any)(req, res, next);
});
// GET /auth/google/callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {session: false, failureRedirect: `${env.corsOrigin}/auth?error=facebook`}),
  authController.socialAuthCheck,
);

export const authRouter = router;
