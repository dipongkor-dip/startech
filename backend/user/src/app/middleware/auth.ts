import {Request, Response, NextFunction} from "express";
import {verifyToken} from "../helper/jwt";
import {JwtPayload} from "jsonwebtoken";
import status from "http-status";
import ServerError from "../errors/ServerError";

export interface AuthenticatedRequest extends Request {
  token?: JwtPayload;
}

export const auth = (...roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const accessToken = req.headers.accessToken || req.cookies.accessToken;

    if (!accessToken) {
      return res.status(status.FORBIDDEN).json({error: "Token not Found"});
    }

    try {
      const token = verifyToken(accessToken) as JwtPayload;

      if (roles.length && !roles.includes(token.role)) throw new ServerError(status.UNAUTHORIZED, "Unauthorized User");

      req.token = token as JwtPayload;

      next();
    } catch {
      return res.status(status.BAD_REQUEST).json({error: "Invalid or expired token"});
    }
  };
};
