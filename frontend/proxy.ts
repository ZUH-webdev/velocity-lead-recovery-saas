import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/signin', '/signup'];
const PROTECTED_PREFIXES = ['/dashboard'];

function hasAuthToken(request: NextRequest): boolean {
  return request.cookies.has('refreshToken') || request.cookies.has('velocity_token');
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = hasAuthToken(request);

  if (AUTH_PAGES.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (PROTECTED_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('next', `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/signin/:path*', '/signup/:path*', '/dashboard/:path*'],
};
