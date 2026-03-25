import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Protect /admin routes (except the login page)
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    if (token !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Auto-redirect logged in users away from login page
  if (request.nextUrl.pathname === '/admin/login' && token === 'true') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
