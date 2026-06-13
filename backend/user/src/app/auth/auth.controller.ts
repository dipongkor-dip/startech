import {Request, Response, NextFunction} from "express";
import status from "http-status";
import {checkRateLimit, deleteOTP, getOTP, redisClient, setOTP, setRateLimit} from "../config/redis";
import {sendOTPbyMail} from "../config/nodemailer";
import {generateOtp} from "../helper/otp";
import {JwtPayload} from "jsonwebtoken";
import {AuthenticatedRequest} from "../middleware/authentication";
import catchAsync from "../utils/catchAsync";
import {authService} from "./auth.service";
import {changePasswordDTO, loginDTO, sendOtpDTO, verifyOtpDTO} from "./auth.validation";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone, password} = req.body;
  console.log("object", email, password)

  try {
    const {accessToken, refreshToken, isValidated, needPasswordReset} = await authService.login(req.body as loginDTO);

    res
      .status(status.OK)
      .json({success: true, message: "Login successful", accessToken, refreshToken, isValidated, needPasswordReset, loginCredential: email ? email : phone});
  } catch (error) {
    next(error);
  }
});

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone} = req.body;
  try {
    await authService.register(req.body);

    res.status(status.CREATED).json({success: true, message: "Registration successful. Please verify your OTP.", loginCredential: email ? email : phone});
  } catch (error: any) {
    next(error);
  }
});

const sendOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone} = req.body;
  const otp = generateOtp();

  try {
    await authService.sendOtpUserCheck(req.body as sendOtpDTO);

    const otpKey = email ? `otp:${email}` : `otp:${phone}`;
    const rateLimitKey = email ? `rate:${email}` : `rate:${phone}`;

    const isRateLimited = await checkRateLimit(otpKey);
    if (isRateLimited) {
      res.status(status.TOO_MANY_REQUESTS).json({success: false, message: "Too many requests. Please try again later."});
      return;
    }

    // Store OTP for 5 minutes
    await setOTP(otpKey, otp, 5 * 60);

    // Rate limit for 1 minute
    await setRateLimit(rateLimitKey, 60);

    if (email) {
      await sendOTPbyMail(email as string, otp);
    } else {
      // Implement send SMS logic here using your preferred SMS gateway
    }

    res.status(status.OK).json({success: true, message: `OTP sent to ${email ? "email" : "phone"}.`});
  } catch (error) {
    next(error);
  }
});

const verifyOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone, otp} = req.body;

  try {
    const {accessToken, refreshToken, isValidated} = await authService.verifyOtp(req.body as verifyOtpDTO);

    if (email) {
      const otpKey = `otp:${email}`;
      const storedOtp = await getOTP(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        res.status(status.BAD_REQUEST).json({success: false, message: "OTP expired or not found"});
        return;
      }

      await deleteOTP(otpKey);

      res.status(status.OK).json({success: true, message: "OTP verified successfully", accessToken, refreshToken, isValidated});
    } else if (phone) {
      const otpKey = `otp:${phone}`;
      const storedOtp = await getOTP(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        res.status(status.BAD_REQUEST).json({success: false, message: "OTP expired or not found"});
        return;
      }

      await deleteOTP(otpKey);

      res.status(status.OK).json({success: true, message: "OTP verified successfully", accessToken, refreshToken, isValidated});
    } else {
      res.status(status.BAD_REQUEST).json({success: false, message: "Email or phone is required"});
    }
  } catch (error) {
    next(error);
  }
});

const me = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const {userId} = req.token as JwtPayload;

  try {
    const user = await authService.getMe(userId);

    res.status(status.OK).json({success: true, message: "User retrieved successfully", user});
  } catch (error) {
    next(error);
  }
});

const changePassword = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const {userId} = req.token as JwtPayload;

  try {
    await authService.changePassword(userId, req.body as changePasswordDTO);
    res.status(status.OK).json({success: true, message: "Password changed successfully"});
  } catch (error) {
    next(error);
  }
});

export const authController = {login, register, verifyOtp, sendOtp, me, changePassword};
