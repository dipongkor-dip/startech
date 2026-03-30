// Server-side: use API_URL (Docker: http://user:3003). Client: use same-origin /api
export const getApiUrl = () =>
  typeof window === 'undefined'
    ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'
    : '';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 3, // 3 days
};

export { COOKIE_OPTIONS };

