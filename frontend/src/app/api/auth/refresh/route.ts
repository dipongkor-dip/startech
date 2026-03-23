import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl, COOKIE_OPTIONS } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }
    const res = await fetch(`${getApiUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      const response = NextResponse.json(data, { status: res.status });
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set('accessToken', data.accessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 15 });
    response.cookies.set('refreshToken', data.refreshToken, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
