import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client backed by Next.js cookies.
 * Works in Server Actions (read + write) and Server Components (read-only).
 * Call this inside async Server Functions — do NOT share across requests.
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        storage: {
          getItem: (key: string) => cookieStore.get(key)?.value ?? null,
          setItem: (key: string, value: string) => {
            try {
              cookieStore.set(key, value, {
                path: '/',
                sameSite: 'lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 7 days
              })
            } catch {
              // Read-only context (Server Component rendering) — safe to ignore
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.delete(key)
            } catch {
              // Read-only context — safe to ignore
            }
          },
        },
      },
    }
  )
}

/** Extract the Supabase project ref from the URL env var. */
export function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  // e.g. https://abcdefghijklmnop.supabase.co  →  abcdefghijklmnop
  return url.replace('https://', '').split('.')[0]
}

/** The cookie name Supabase JS v2 uses to store the session token. */
export function sessionCookieName(): string {
  return `sb-${getProjectRef()}-auth-token`
}
