import jwt, {JwtPayload} from "jsonwebtoken";
import env from "../env";

export function verifyToken(token: string): JwtPayload | null {
  return jwt.verify(token, env.jwt_secret) as JwtPayload;
}
