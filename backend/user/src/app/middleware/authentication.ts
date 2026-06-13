import {Request, Response, NextFunction} from "express";
import {verifyToken} from "../helper/jwt";
import {JwtPayload} from "jsonwebtoken";
import status from "http-status";
import ServerError from "../handler/ServerError";
import {prisma} from "../config/database";

export interface AuthenticatedRequest extends Request {
  token?: JwtPayload;
}

export const authentication = (...roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const accessToken = req.headers.accessToken || req.cookies.accessToken;

    if (!accessToken) return res.status(status.FORBIDDEN).json({error: "Token not Found"});

    try {
      const token = verifyToken(accessToken) as JwtPayload;

      const user = await prisma.user.findUniqueOrThrow({where: {id: token.userId}, select: {isValidated: true, role: true}});

      if (roles.length && !roles.includes(token.role) && !user?.isValidated && user.role !== token.role) throw new ServerError(status.UNAUTHORIZED, "Unauthorized User");

      req.token = token as JwtPayload;

      next();
    } catch {
      return res.status(status.BAD_REQUEST).json({error: "Invalid or expired token"});
    }
  };
};
