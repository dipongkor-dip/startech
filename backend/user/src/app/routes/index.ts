import {Router} from "express";
import {userController} from "../controllers";
import {auth} from "../middleware/auth";
import {UserRole} from "@prisma/client";

const router = Router();

router.post("/register", userController.register);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.sendOtp);
router.post("/login", userController.login);
router.get(
  "/me",
  auth(UserRole.admin, UserRole.customer, UserRole.customerSupportManager, UserRole.deliveryBoy, UserRole.superAdmin, UserRole.productManager),
  userController.me,
);

export default router;
