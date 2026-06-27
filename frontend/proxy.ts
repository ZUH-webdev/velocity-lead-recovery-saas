import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_PAGES = ['/sign-in', '/sign-up']
const PROTECTED_PREFIXES = ['/dashboard', '/onboarding']

function hasAuthToken(request: NextRequest): boolean {
  // velocity_authed is a presence-only cookie set by setToken() on the client
  // The actual access token lives in localStorage and is not readable here
  return request.cookies.has('velocity_authed')
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isAuthenticated = hasAuthToken(request)

  // Redirect authenticated users away from auth pages
  if (AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Redirect unauthenticated users away from protected pages
  if (PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('next', `${pathname}${search}`)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sign-in/:path*', '/sign-up/:path*', '/dashboard/:path*', '/onboarding/:path*'],
}