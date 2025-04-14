import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Allow always-accessible public routes
  const publicRoutes = ['/', '/login', '/signup'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Admin-only routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/profile')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ✅ Student-only routes
  if (
    pathname === '/main' ||
    pathname.startsWith('/interested') ||
    pathname.startsWith('/bookmarked')
  ) {
    if (userRole !== 'student') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ✅ Shared authenticated route
  if (pathname.startsWith('/details')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/main',
    '/interested/:path*',
    '/bookmarked/:path*',
    '/details/:path*',
  ],
};
