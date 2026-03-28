import {Request, Response, NextFunction} from "express";
import {verifyToken} from "../helper/jwt";
import {JwtPayload} from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  token?: JwtPayload;
}

export const auth = (...roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const accessToken = req.headers.accessToken || req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({error: "Unauthorized"});
    }

    try {
      const token = verifyToken(accessToken) as JwtPayload;

      if (roles.length && !roles.includes(token.role)) throw new Error("Forbidden");

      req.token = token as JwtPayload;

      next();
    } catch {
      return res.status(401).json({error: "Invalid or expired token"});
    }
  };
};
