import { NextRequest, NextResponse } from 'next/server'
import {JwtPayload} from 'jsonwebtoken'
import {UserRole} from './types'
import {verifyToken} from './utils/jwt'
import { getCookie, deleteCookie } from './utils/serverCookie'

const authRoutes = ["/login", "/forgot-password", "/otp-verification", "/password-change"]
const publicRoutes = ["/", "/about", "/contact"]
const isAuthRoute = (pathname: string) => authRoutes.some((route: string) => route === pathname)
const isPublicRoute = (pathname: string) => publicRoutes.some((route: string) => route === pathname)

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname

  // Handle authentication redirects
  let userRole: UserRole | null = null
  const accessToken = await getCookie('accessToken')

  // If user has a valid token and tries to access auth routes, redirect to dashboard
  if (accessToken) {
    const verifiedToken: JwtPayload | string = await verifyToken(accessToken)

    if (typeof verifiedToken === "string") {
      // Token is invalid, clear cookies and redirect to login
      await deleteCookie('accessToken')
      await deleteCookie('refreshToken')
      return NextResponse.redirect(new URL("/login", request.url))
    }
    
    userRole = verifiedToken.payload?.role
    
    // If authenticated user tries to access auth routes, redirect to dashboard
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } else {
    // If no token and trying to access protected routes, redirect to login
    if (!isPublicRoute(pathname) && !isAuthRoute(pathname) && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
  
  // Continue with the request - don't return anything to let it pass through
}

export const config = {
  matcher: ['/api/:path*', '/login', '/forgot-password', '/otp-verification', '/password-change', '/dashboard/:path*'],
}
