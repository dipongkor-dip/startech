import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_OPTIONS } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json();
    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Tokens required' }, { status: 400 });
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 15 });
    response.cookies.set('refreshToken', refreshToken, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set cookies' }, { status: 500 });
  }
}
