import {NextRequest, NextResponse} from "next/server";
import {JwtPayload} from "jsonwebtoken";
import {getCookie, verifyToken} from "./utils/jwt"; // ডিলিট কুকি মিডলওয়্যার নেটিভলি করবে
import {UserRole} from "./store/slices/auth/interface";

const dashboardRoutes = ["/dashboard", "/delivery-boy/dashboard", "/su-admin/dashboard", "/admin/dashboard", "/support-manager/dashboard", "/product-manager/dashboard"];
const authRoutes = ["/auth", "/forgot-password", "/password-change"];
const publicRoutes = ["/", "/about", "/contact"];

const isAuthRoute = (pathname: string): boolean => authRoutes.some((route: string) => route === pathname);
const isPublicRoute = (pathname: string): boolean => publicRoutes.some((route: string) => route === pathname);

// ফিক্সড: সাব-রাউটও যেন ক্যাচ করতে পারে (যেমন: /admin/dashboard/settings)
const isDashboardRoute = (pathname: string): boolean => dashboardRoutes.some((route: string) => pathname === route || pathname.startsWith(route + "/"));

export const roleBaseDashboards: Record<string, string> = {
  [UserRole.ADMIN]: "/admin/dashboard",
  [UserRole.SUPER_ADMIN]: "/su-admin/dashboard",
  [UserRole.PRODUCT_MANAGER]: "/product-manager/dashboard",
  [UserRole.CUSTOMER_SUPPORT_MANAGER]: "/support-manager/dashboard",
  [UserRole.DELIVERY_BOY]: "/delivery-boy/dashboard",
  [UserRole.CUSTOMER]: "/dashboard",
};

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  const accessToken = await getCookie("accessToken");

  if (accessToken) {
    try {
      const verifiedToken = (await verifyToken(accessToken)) as JwtPayload;

      const userRole = verifiedToken.role;
      const expectedDashboard = roleBaseDashboards[userRole] || "/dashboard";

      // ইউজার যদি লগইন থাকা অবস্থায় পুনরায় লগইন/অথ পেজে যেতে চায়
      if (isAuthRoute(pathname)) {
        return NextResponse.redirect(new URL(expectedDashboard, request.url));
      }

      // ইউজার ভুল ড্যাশবোর্ডে ঢুকলে সঠিক ড্যাশবোর্ডে পুশ করা
      if (isDashboardRoute(pathname)) {
        if (!pathname.startsWith(expectedDashboard)) {
          return NextResponse.redirect(new URL(expectedDashboard, request.url));
        }
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/auth", request.url));

      // response অবজেক্টকে সাময়িকভাবে any টাইপে কনভার্ট করা
      (response as any).cookies.delete("accessToken");
      (response as any).cookies.delete("refreshToken");
      return response;
    }
  } else {
    // টোকেন না থাকলে এবং প্রোটেক্টেড রুট হলে লগইন পেজে রিডাইরেক্ট
    if (!isPublicRoute(pathname) && !isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // টাইপস্ক্রিপ্ট বাইপাস করে রিকোয়েস্ট পাস করার পারফেক্ট কোড
  return (NextResponse as any).next();
}

export const config = {
  matcher: [
    "/auth",
    "/forgot-password",
    "/otp-verification",
    "/password-change",
    "/dashboard/:path*",
    "/admin/dashboard/:path*",
    "/su-admin/dashboard/:path*",
    "/product-manager/dashboard/:path*",
    "/support-manager/dashboard/:path*",
    "/delivery-boy/dashboard/:path*",
  ],
};
