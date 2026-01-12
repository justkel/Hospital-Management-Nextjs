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

const allRoles: Roles[] = Object.values(Roles);
const routeRoles: Record<string, Roles[]> = {
  '/dashboard/admin': [...allRoles],
  '/dashboard/doctor': [Roles.DOCTOR, Roles.ADMIN],
};

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  // redirect if not authenticated
  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // redirect logged-in users away from login
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // role-based access control
  if (isProtected && accessToken) {
    try {
      const decoded: JwtPayload = jwtDecode(accessToken);

      for (const [path, allowedRoles] of Object.entries(routeRoles)) {
        if (req.nextUrl.pathname.startsWith(path)) {
          const hasAccess = decoded.roles.some(role => allowedRoles.includes(role as Roles));
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
  matcher: ['/dashboard/:path*', '/login'],
};
