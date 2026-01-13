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
  '/dashboard/admins': [...Object.values(Roles)],
  '/dashboard/doctor': [Roles.DOCTOR, Roles.ADMIN],
  '/admins': [Roles.ADMIN],
};

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isProtected =
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/admins');

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isProtected && accessToken) {
    try {
      const decoded: JwtPayload = jwtDecode(accessToken);

      for (const [path, allowedRoles] of Object.entries(routeRoles)) {
        if (req.nextUrl.pathname.startsWith(path)) {
          const hasAccess = decoded.roles.some((role) =>
            allowedRoles.includes(role as Roles)
          );
          if (!hasAccess) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
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
