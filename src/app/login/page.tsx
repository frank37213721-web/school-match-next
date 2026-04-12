'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn, AuthState } from '@/lib/auth-actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, undefined)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>

        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: '12px',
            background: '#000',
            margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: '1.5rem' }}>校</span>
          </div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            選校媒合平台
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6e6e73', margin: '0.375rem 0 0' }}>
            教師帳號登入
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <div style={{
            background: '#fff2f2',
            border: '1px solid #ffcccc',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            color: '#cc0000',
          }}>
            {state.error}
          </div>
        )}

        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="密碼"
              required
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop: '0.25rem',
              padding: '0.8125rem',
              background: pending ? '#555' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: pending ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 0.15s',
            }}
          >
            {pending ? '登入中…' : '登入'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          margin: '1.5rem 0',
        }}>
          <div style={{ flex: 1, height: 1, background: '#d2d2d7' }} />
          <span style={{ fontSize: '0.8125rem', color: '#6e6e73' }}>或</span>
          <div style={{ flex: 1, height: 1, background: '#d2d2d7' }} />
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6e6e73', margin: 0 }}>
          還沒有帳號？{' '}
          <Link href="/register" style={{ color: '#0071e3', fontWeight: 500, textDecoration: 'none' }}>
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8125rem 1rem',
  background: '#f5f5f7',
  border: '1px solid transparent',
  borderRadius: 10,
  fontSize: '0.9375rem',
  outline: 'none',
  color: '#1d1d1f',
  appearance: 'none',
  transition: 'border-color 0.15s',
}
