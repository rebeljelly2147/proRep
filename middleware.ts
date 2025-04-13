import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get('userRole')?.value;
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (
    (pathname.startsWith('/admin') || pathname === '/dashboard') &&
    userRole !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
  }

  // Protect student routes
  if (
    (pathname.startsWith('/student') || pathname === '/main') &&
    userRole !== 'student'
  ) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/main',
    '/dashboard',
  ],
};
