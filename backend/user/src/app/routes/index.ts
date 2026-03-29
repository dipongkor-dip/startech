import {Router} from "express";
import {userController} from "../controllers";
import {auth} from "../middleware/auth";
import {UserRole} from "@prisma/client";

const router = Router();

router.post("/register", userController.register);
router.post("/verify-otp", userController.verifyOtp);
router.post("/send-otp", userController.sendOtp);
router.post("/login", userController.login);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SUPER_ADMIN, UserRole.DELIVERY_BOY, UserRole.CUSTOMER_SUPPORT_MANAGER, UserRole.PRODUCT_MANAGER),
  userController.me,
);

export default router;
