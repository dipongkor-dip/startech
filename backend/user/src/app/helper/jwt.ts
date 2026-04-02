import jwt, {JwtPayload, SignOptions} from "jsonwebtoken";
import {env} from "../env";

export function signAccessToken(userId: string, role: string): string {
  return jwt.sign({userId, role, type: "access"}, env.jwt_secret, {expiresIn: "1d"} as SignOptions);
}

export function signRefreshToken(userId: string, role: string): string {
  return jwt.sign({userId, role, type: "refresh"}, env.jwt_secret, {expiresIn: "3d"} as SignOptions);
}

export function verifyToken(token: string): JwtPayload | null {
  return jwt.verify(token, env.jwt_secret) as JwtPayload;
}
