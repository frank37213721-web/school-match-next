'use client'

import { useState, useActionState } from 'react'
import { signIn, signUp, AuthState } from '@/lib/auth-actions'

export default function HomePage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      background: '#fff',
    }}>
      {/* ── Left: Branding ── */}
      <div style={{
        flex: '0 0 45%',
        background: '#0a0a0a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 3.5rem',
      }}>
        {/* Logo */}
        <div style={{
          width: 52, height: 52,
          borderRadius: 14,
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '2rem',
        }}>
          <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>校</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.75rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          選校媒合平台
        </h1>
        <p style={{ fontSize: '1rem', color: '#a1a1aa', margin: '0 0 3rem', lineHeight: 1.6 }}>
          高中職跨校課程匯流系統<br />連結優質師資，擴展教學資源
        </p>

        {/* Feature list */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            ['📚', '發現全台優質課程資源'],
            ['🤝', '媒合跨校教師合作'],
            ['📊', '追蹤配對與報名狀態'],
          ].map(([icon, text]) => (
            <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: '#d4d4d8' }}>
              <span>{icon}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right: Auth card ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            border: '1.5px solid #000',
            marginBottom: '2rem',
          }}>
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '0.625rem',
                  border: 'none',
                  background: tab === t ? '#000' : '#fff',
                  color: tab === t ? '#fff' : '#000',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {t === 'login' ? '登入' : '註冊'}
              </button>
            ))}
          </div>

          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}

/* ────────────────── Login form ────────────────── */
function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signIn, undefined)

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>歡迎回來</h2>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#71717a' }}>請輸入您的帳號資訊</p>

      {state?.error && <ErrorBox message={state.error} />}

      <Field label="Email">
        <input type="email" name="email" placeholder="teacher@school.edu.tw" required autoComplete="email" style={inputStyle} />
      </Field>

      <Field label="密碼">
        <input type="password" name="password" placeholder="••••••••" required autoComplete="current-password" style={inputStyle} />
      </Field>

      <button type="submit" disabled={pending} style={submitStyle(pending)}>
        {pending ? '登入中…' : '登入'}
      </button>
    </form>
  )
}

/* ────────────────── Register form ────────────────── */
function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, undefined)

  if (state?.message) {
    return (
      <div style={{
        border: '1.5px solid #000',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '0.9375rem',
        lineHeight: 1.6,
      }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✉️</p>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>註冊成功</p>
        <p style={{ color: '#52525b' }}>{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>建立帳號</h2>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#71717a' }}>填寫學校資訊與登入憑證</p>

      {state?.error && <ErrorBox message={state.error} />}

      <Field label="學校名稱 *">
        <input type="text" name="school_name" placeholder="例：國立台灣師範大學附中" required style={inputStyle} />
      </Field>

      {/* school_code 目前留空，待 Supabase 搜尋串接後補上 */}
      <input type="hidden" name="school_code" value="000000" />

      <Field label="縣市">
        <input type="text" name="city" placeholder="例：台北市" style={inputStyle} />
      </Field>

      <Field label="Email *">
        <input type="email" name="email" placeholder="teacher@school.edu.tw" required autoComplete="email" style={inputStyle} />
      </Field>

      <Field label="密碼（至少 8 位）*">
        <input type="password" name="password" placeholder="••••••••" required minLength={8} autoComplete="new-password" style={inputStyle} />
      </Field>

      <button type="submit" disabled={pending} style={submitStyle(pending)}>
        {pending ? '建立中…' : '建立帳號'}
      </button>
    </form>
  )
}

/* ────────────────── Shared sub-components ────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{
      border: '1.5px solid #000',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      background: '#fafafa',
    }}>
      {message}
    </div>
  )
}

/* ────────────────── Shared styles ────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6875rem 0.875rem',
  border: '1.5px solid #000',
  background: '#fff',
  fontSize: '0.9375rem',
  outline: 'none',
  appearance: 'none',
  color: '#000',
}

const submitStyle = (pending: boolean): React.CSSProperties => ({
  marginTop: '0.25rem',
  padding: '0.8125rem',
  background: pending ? '#52525b' : '#000',
  color: '#fff',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: pending ? 'not-allowed' : 'pointer',
  transition: 'background 0.15s',
})
