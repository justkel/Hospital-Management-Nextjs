import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token');

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
