import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {deleteCookie, getCookie} from "./utils/serverCookie";
import {verifyToken} from "./utils/jwt";
import {JwtPayload} from "jsonwebtoken";
import {UserRole} from "./types";

const authRoutes = ["/login", "/forgot-password"];
const isAuthRoute = (pathname: string) => authRoutes.some((route: string) => route === pathname);

export async function proxy(request: NextRequest) {
  console.log("request", request);

  let userRole: UserRole | null = null;
  const accessToken = getCookie("stAccessToken") || null;

  if (accessToken) {
    const verifiedToken: JwtPayload | string = await verifyToken(accessToken);

    if (typeof verifiedToken === "string") {
      deleteCookie("stAccessToken");
      deleteCookie("stRefreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    userRole = verifiedToken.payload?.role;
  }
}

export const config = {
  matcher: "/about/:path*",
};
