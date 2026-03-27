import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl, COOKIE_OPTIONS } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${getApiUrl()}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    const response = NextResponse.json({ user: data.user });
    response.cookies.set('accessToken', data.accessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 15 });
    response.cookies.set('refreshToken', data.refreshToken, COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json({ error: 'OTP verification failed' }, { status: 500 });
  }
}
