import jwt, {Jwt, JwtPayload, SignOptions} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-change-in-production";
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "3d";

export function signAccessToken(userId: string, role: string): string {
  return jwt.sign({sub: userId, type: "access", role}, JWT_SECRET, {expiresIn: ACCESS_EXPIRES} as SignOptions);
}

export function signRefreshToken(userId: string, role: string): string {
  return jwt.sign({sub: userId, type: "refresh", role}, JWT_SECRET, {expiresIn: REFRESH_EXPIRES} as SignOptions);
}

export function verifyToken(token: string): JwtPayload | null {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
