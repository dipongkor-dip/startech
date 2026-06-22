import {NextRequest, NextResponse} from "next/server";
import {JwtPayload} from "jsonwebtoken";
import {deleteCookie, getCookie, verifyToken} from "./utils/jwt";

const authRoutes = ["/auth", "/forgot-password", "/otp-verification", "/password-change"];
const publicRoutes = ["/", "/about", "/contact"];
const isAuthRoute = (pathname: string) => authRoutes.some((route: string) => route === pathname);
const isPublicRoute = (pathname: string) => publicRoutes.some((route: string) => route === pathname);

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname;

  const accessToken = await getCookie("accessToken");

  // If user has a valid token and tries to access auth routes, redirect to dashboard
  if (accessToken) {
    const verifiedToken: JwtPayload | string = await verifyToken(accessToken);

    if (typeof verifiedToken === "string") {
      // Token is invalid, clear cookies and redirect to login
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // If authenticated user tries to access auth routes, redirect to dashboard
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // If no token and trying to access protected routes, redirect to login
    if (!isPublicRoute(pathname) && !isAuthRoute(pathname) && !pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Continue with the request - don't return anything to let it pass through
}

export const config = {
  matcher: ["/api/:path*", "/auth", "/forgot-password", "/otp-verification", "/password-change", "/dashboard/:path*"],
};
