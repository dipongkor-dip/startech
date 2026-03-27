import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const res = await fetch(`${getApiUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
