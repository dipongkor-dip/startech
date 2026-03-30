import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl, COOKIE_OPTIONS } from '@/lib/api';
import { setCookie } from '@/utils/serverCookie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    body.login = body.login ?? body.email ?? body.phone;
    const res = await fetch(`${getApiUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    
    // Set cookies using serverCookie.ts
    setCookie('accessToken', data.accessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 15 }); // 15 min
    setCookie('refreshToken', data.refreshToken, COOKIE_OPTIONS);
    
    return NextResponse.json({ user: data.user, isValidated: data.isValidated, needPasswordReset: data.needPasswordReset });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
