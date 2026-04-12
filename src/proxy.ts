import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Protected routes — redirect to /login if no session cookie found. */
const PROTECTED = ['/dashboard', '/matches']

/**
 * Supabase JS v2 stores the session under the key:
 *   sb-<project-ref>-auth-token
 * We derive the project ref at build time from the env var so the proxy
 * can run without a dynamic look-up.
 */
const projectRef = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '')
  .replace('https://', '')
  .split('.')[0]

const SESSION_COOKIE = `sb-${projectRef}-auth-token`

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isProtected) return NextResponse.next()

  // Check for a Supabase session cookie (optimistic — no DB round-trip).
  const hasSession =
    request.cookies.has(SESSION_COOKIE) ||
    // Fall back: any sb-*-auth-token cookie in case the URL isn't set yet
    request.cookies.getAll().some((c) => c.name.endsWith('-auth-token'))

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/matches/:path*',
  ],
}
