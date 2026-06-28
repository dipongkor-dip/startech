import {Request, Response, NextFunction} from "express";
import status from "http-status";
import {checkRateLimit, deleteOTP, getOTP, setOTP, setRateLimit} from "../../config/redis";
import {sendOTPbyMail} from "../../config/nodemailer";
import {generateOtp} from "../../helper/otp";
import {JwtPayload} from "jsonwebtoken";
import {AuthenticatedRequest} from "../../middleware/authentication";
import catchAsync from "../../utils/catchAsync";
import {authService} from "./auth.service";
import {addEmployeeDTO, changePasswordDTO, loginDTO, sendOtpDTO, verifyOtpDTO} from "./auth.validation";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {accessToken, refreshToken} = await authService.login(req.body as loginDTO);

    res.cookie("accessToken", accessToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000}); // 7 days
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60 * 1000}); // 30 days

    res.status(status.OK).json({success: true, message: "Login successful"});
  } catch (error) {
    next(error);
  }
});

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone} = req.body;
  try {
    const {accessToken, refreshToken} = await authService.register(req.body);

    res.cookie("accessToken", accessToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000}); // 7 days
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60 * 1000}); // 30 days
    
    const otpKey = email ? `otp:${email}` : `otp:${phone}`;
    const rateLimitKey = email ? `rate:${email}` : `rate:${phone}`;

    res.status(status.CREATED).json({success: true, message: "Registration successful. Please verify your OTP."});
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
    const {accessToken, refreshToken} = await authService.verifyOtp(req.body as verifyOtpDTO);

    if (email) {
      const otpKey = `otp:${email}`;
      const storedOtp = await getOTP(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        res.status(status.BAD_REQUEST).json({success: false, message: "OTP expired or not found"});
        return;
      }

      await deleteOTP(otpKey);

      res.cookie("accessToken", accessToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000}); // 7 days
      res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60 * 1000}); // 30 days

      res.status(status.OK).json({success: true, message: "OTP verified successfully"});
    } else if (phone) {
      const otpKey = `otp:${phone}`;
      const storedOtp = await getOTP(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        res.status(status.BAD_REQUEST).json({success: false, message: "OTP expired or not found"});
        return;
      }

      await deleteOTP(otpKey);

      res.cookie("accessToken", accessToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000}); // 7 days
      res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60 * 1000}); // 30 days

      res.status(status.OK).json({success: true, message: "OTP verified successfully"});
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
    const data = await authService.getMe(userId);

    res.status(status.OK).json({success: true, message: "User retrieved successfully", data});
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

const addEmployee = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const {role} = req.token as JwtPayload;
  try {
    const employee = await authService.addEmployee(req.body as addEmployeeDTO, role as string);

    res.status(status.CREATED).json({success: true, message: "Employee added successfully", employee});
  } catch (error) {
    next(error);
  }
});

const googleAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = await authService.googleAuth();

    res.status(status.CREATED).json({success: true, message: "Login successfully", auth});
  } catch (error) {
    next(error);
  }
});

const facebookAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = await authService.facebookAuth();

    res.status(status.CREATED).json({success: true, message: "Login successfully", auth});
  } catch (error) {
    next(error);
  }
});

export const authController = {login, register, verifyOtp, sendOtp, me, changePassword, addEmployee};
