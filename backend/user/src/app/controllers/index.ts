import {Request, Response, NextFunction} from "express";
import {userService} from "../services";
import status from "http-status";
import {checkRateLimit, deleteOTP, getOTP, setOTP, setRateLimit} from "../config/redis";
import {sendOTPbyMail} from "../config/nodemailer";
import {generateOtp} from "../helper/otp";
import {JwtPayload} from "jsonwebtoken";
import {AuthenticatedRequest} from "../middleware/auth";
import catchAsync from "../utils/catchAsync";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone, password} = req.body;

  if ((!email && phone) || (email && !phone) || !password) {
    res.status(status.BAD_REQUEST).json({success: false, message: "Login and password required"});
    return;
  }

  try {
    const {accessToken, refreshToken} = await userService.login(email, phone, password);

    res.status(status.OK).json({success: true, message: "Login successful", accessToken, refreshToken});
  } catch (error) {
    next(error);
  }
});

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone, password, name} = req.body;

  const userName = name ? name : email ? email.match(/^([a-zA-Z]+)(?=[0-9]*@)/)?.[1] : "User";

  try {
    await userService.register(email, phone, password, userName);

    res.status(status.CREATED).json({success: true, message: "Registration successful. Please verify your OTP."});
  } catch (error: any) {
    next(error);
  }
});

const sendOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, phone} = req.body;
  const otp = generateOtp();

  try {
    await userService.sendOtpUserCheck(email, phone);

    let otpKey: string;
    if (email) {
      otpKey = `otp:${email}`;
    } else if (phone) {
      otpKey = `otp:${phone}`;
    } else {
      res.status(status.BAD_REQUEST).json({success: false, message: "Email or phone is required"});
      return;
    }

    const isRateLimited = await checkRateLimit(otpKey);
    if (isRateLimited) {
      res.status(status.TOO_MANY_REQUESTS).json({success: false, message: "Too many requests. Please try again later."});
      return;
    }

    await setOTP(otpKey, otp, 5 * 60); // OTP expires in 5 minutes

    await setRateLimit(otpKey, 60); // Rate limit for 1 minute

    // sendMail or sendSMS with the OTP here

    if (email) {
      await sendOTPbyMail(email, otp);
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

  if (!otp) {
    res.status(status.BAD_REQUEST).json({success: false, message: "OTP is required"});
    return;
  }

  try {
    if (email) {
      const otpKey = `otp:${email}`;
      const storedOtp = await getOTP(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        res.status(status.BAD_REQUEST).json({success: false, message: "OTP expired or not found"});
        return;
      }

      const {accessToken, refreshToken} = await userService.verifyOtp(email, null);

      await deleteOTP(otpKey);

      res.status(status.OK).json({success: true, message: "OTP verified successfully", accessToken, refreshToken});
    } else if (phone) {
      const otpKey = `otp:${phone}`;
      const storedOtp = await getOTP(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        res.status(status.BAD_REQUEST).json({success: false, message: "OTP expired or not found"});
        return;
      }

      const {accessToken, refreshToken} = await userService.verifyOtp(null, phone);

      await deleteOTP(otpKey);

      res.status(status.OK).json({success: true, message: "OTP verified successfully", accessToken, refreshToken});
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
    const user = await userService.getMe(userId);

    res.status(status.OK).json({success: true, message: "User retrieved successfully", user});
  } catch (error) {
    next(error);
  }
});

export const userController = {login, register, verifyOtp, sendOtp, me};
