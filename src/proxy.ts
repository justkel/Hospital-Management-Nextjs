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
  '/dashboard/patients': [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.GUEST],
  '/dashboard/patients/:id/wallet': [
    Roles.ADMIN,
    Roles.DOCTOR,
    Roles.NURSE,
    Roles.BILLING_OFFICER,
    Roles.GUEST,
  ],
  '/dashboard/visit-procedures': [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.GUEST],
  '/dashboard/wards': [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.GUEST],
  '/dashboard/theatres': [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.GUEST],
  '/dashboard/visits': [
    Roles.ADMIN,
    Roles.DOCTOR,
    Roles.NURSE,
    Roles.BILLING_OFFICER,
    Roles.GUEST
  ],
  '/dashboard/lab-requests': [
    Roles.ADMIN,
    Roles.DOCTOR,
    Roles.NURSE,
    Roles.LAB_TECH,
    Roles.GUEST
  ],
  '/dashboard/financials': [Roles.ADMIN, Roles.BILLING_OFFICER],

  // Admin only
  '/dashboard/guest-requests': [Roles.ADMIN],
  '/dashboard/audit': [Roles.ADMIN],
  '/dashboard/settings/feature-flags': [Roles.ADMIN],
  '/admins/staff': [Roles.ADMIN, Roles.DOCTOR],
  '/admins/billing': [Roles.ADMIN, Roles.GUEST],
  '/admins': [Roles.ADMIN],
};

function routeToRegex(route: string): RegExp {
  const pattern = route
    .split('/')
    .map((seg) => (seg.startsWith(':') ? '[^/]+' : seg))
    .join('/');
  return new RegExp(`^${pattern}(/.*)?$`);
}

const compiledRoutes = Object.entries(routeRoles)
  // Longest path first = most specific route wins.
  .sort((a, b) => b[0].length - a[0].length)
  .map(([route, roles]) => ({ regex: routeToRegex(route), roles, route }));

function getAllowedRoles(pathname: string): Roles[] | undefined {
  const match = compiledRoutes.find(({ regex }) => regex.test(pathname));
  return match?.roles;
}

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith('/login');
  const isProtected =
    pathname.startsWith('/dashboard') || pathname.startsWith('/admins');

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isProtected && accessToken) {
    try {
      const decoded: JwtPayload = jwtDecode(accessToken);
      const allowedRoles = getAllowedRoles(pathname);

      if (allowedRoles) {
        const hasAccess = decoded.roles.some((role) =>
          allowedRoles.includes(role as Roles),
        );
        if (!hasAccess) {
          return NextResponse.redirect(new URL('/forbidden', req.url));
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