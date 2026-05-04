import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { Roles } from './shared/utils/enums/roles';

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  org: string;
  userType: string;
  iat: number;
  exp: number;
}

const routeRoles: Record<string, Roles[]> = {
  // Clinical access
  '/dashboard/patients': [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE],
  '/dashboard/visits': [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE],
  '/dashboard/lab-requests': [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.LAB_TECH],

  // Admin only
  '/dashboard/billing': [Roles.ADMIN],
  '/dashboard/audit': [Roles.ADMIN],
  '/admins': [Roles.ADMIN],
};

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;

  const pathname = req.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith('/login');
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admins');

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isProtected && accessToken) {
    try {
      const decoded: JwtPayload = jwtDecode(accessToken);

      for (const [route, allowedRoles] of Object.entries(routeRoles)) {
        if (pathname.startsWith(route)) {
          const hasAccess = decoded.roles.some((role) =>
            allowedRoles.includes(role as Roles)
          );
          if (!hasAccess) {
            return NextResponse.redirect(new URL('/forbidden', req.url));
          }
        }
      }
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admins/:path*', '/login'],
};