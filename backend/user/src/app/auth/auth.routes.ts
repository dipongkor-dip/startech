import {Router} from "express";
import {authentication} from "../middleware/authentication";
import {UserRole} from "@prisma/client";
import {authController} from "./auth.controller";
import {changePasswordSchema, loginSchema, registerSchema, sendOtpSchema, verifyOtpSchema} from "./auth.validation";
import {validateSchema} from "../middleware/validateSchema";

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

export const authRouter = router;
