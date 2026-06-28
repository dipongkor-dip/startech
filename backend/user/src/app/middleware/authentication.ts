import {Request, Response, NextFunction} from "express";
import {signAccessToken, signRefreshToken, verifyToken} from "../helper/jwt";
import {JwtPayload} from "jsonwebtoken";
import status from "http-status";
import ServerError from "../handler/ServerError";
import {prisma} from "../config/database";

export interface AuthenticatedRequest extends Request {
  token?: JwtPayload;
}

export const authentication = (...roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) return res.status(status.FORBIDDEN).json({error: "Access Token not Found"});

    try {
      let decodedToken: JwtPayload;

      try {
        decodedToken = verifyToken(accessToken) as JwtPayload;
      } catch (err: any) {
        if (err.name === "TokenExpiredError" && refreshToken) {
          try {
            const refreshPayload = verifyToken(refreshToken) as JwtPayload;

            const newAccessToken = signAccessToken(refreshPayload.userId, refreshPayload.role);
            const newRefreshToken = signRefreshToken(refreshPayload.userId, refreshPayload.role);

            res.cookie("accessToken", newAccessToken, {httpOnly: true, secure: true});
            res.cookie("refreshToken", newRefreshToken, {httpOnly: true, secure: true});

            decodedToken = verifyToken(newAccessToken) as JwtPayload;
          } catch (refreshErr) {
            return res.status(status.UNAUTHORIZED).json({error: "Session expired. Please login again."});
          }
        } else {
          throw err;
        }
      }

      const user = await prisma.user.findUniqueOrThrow({
        where: {id: decodedToken.userId},
        select: {role: true},
      });

      // ৫. রোল পারমিশন এবং অ্যাকাউন্ট ভ্যালিডেশন চেক লজিক
      const hasRequiredRole = roles.length === 0 || roles.includes(user.role);
      if (!hasRequiredRole) {
        throw new ServerError(status.UNAUTHORIZED, "Unauthorized or Unvalidated User");
      }

      // ৬. রিকোয়েস্টে সাকসেসফুলি টোকেন পেলোড অ্যাসাইন করে সামনে পাঠিয়ে দিন
      req.token = decodedToken;
      next();
    } catch (err: any) {
      // ৭. সেন্ট্রাল ক্যাচ ব্লক: নির্দিষ্ট এরর টাইপ অনুযায়ী রেসপন্স হ্যান্ডলিং

      // প্রিজমা যদি ইউজার খুঁজে না পায় (Record not found - P2025)
      if (err.code === "P2025") {
        return res.status(status.NOT_FOUND).json({
          name: "NotFoundError",
          error: "User account no longer exists",
        });
      }

      // আমাদের কাস্টম তৈরি করা ServerError হলে (যেমন: Unauthorized)
      if (err instanceof ServerError) {
        return res.status(err.status).json({
          name: err.name,
          error: err.message,
        });
      }

      // অন্য যেকোনো আননোন বা টোকেন ভ্যালিডেশন এরর এর জন্য
      return res.status(status.BAD_REQUEST).json({
        name: err.name || "AuthenticationError",
        error: err.message || "Invalid or expired token",
      });
    }
  };
};
