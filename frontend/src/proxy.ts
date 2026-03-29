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
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Handle authentication redirects
  let userRole: UserRole | null = null
  const accessToken = getCookie('accessToken')

  // If user has a valid token and tries to access auth routes, redirect to dashboard
  if (accessToken) {
    const verifiedToken: JwtPayload | string = await verifyToken(accessToken)

    if (typeof verifiedToken === "string") {
      // Token is invalid, clear cookies and redirect to login
      deleteCookie('accessToken')
      deleteCookie('refreshToken')
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
  
  // Add CORS headers to all responses and continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/login', '/forgot-password', '/otp-verification', '/password-change', '/dashboard/:path*'],
  // The proxy function will be called for these routes
}
