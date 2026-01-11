import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token');

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
