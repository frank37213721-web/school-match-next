'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signUp, AuthState } from '@/lib/auth-actions'
import { searchSchools } from '@/lib/supabase'
import { SchoolRegistry } from '@/types/database'

const border = '1.5px solid #000'

export default function RegisterPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUp, undefined)

  // School search state
  const [query, setQuery]               = useState('')
  const [results, setResults]           = useState<SchoolRegistry[]>([])
  const [selected, setSelected]         = useState<SchoolRegistry | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const debounceRef                     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef                      = useRef<HTMLDivElement>(null)

  // Debounced school search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim() || selected) {
      setResults([])
      setDropdownOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const { data } = await searchSchools(query, 12)
      setResults(data ?? [])
      setDropdownOpen((data ?? []).length > 0)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, selected])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(school: SchoolRegistry) {
    setSelected(school)
    setQuery(school.school_name)
    setDropdownOpen(false)
    setResults([])
  }

  function handleClear() {
    setSelected(null)
    setQuery('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#fff',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        border,
        padding: '2.5rem 2rem',
      }}>
        {/* Header */}
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
          教師帳號註冊
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#555', margin: '0 0 2rem' }}>
          選校媒合平台
        </p>

        {/* Feedback messages */}
        {state?.error && (
          <div style={{
            border,
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            color: '#b00',
          }}>
            {state.error}
          </div>
        )}
        {state?.message && (
          <div style={{
            border: '1.5px solid #000',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            background: '#f5f5f5',
          }}>
            {state.message}
          </div>
        )}

        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* School search */}
          <div ref={wrapperRef} style={{ position: 'relative' }}>
            <label style={labelStyle}>學校名稱或代碼 *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="輸入學校名稱或 6 位代碼搜尋…"
                value={query}
                onChange={(e) => { setSelected(null); setQuery(e.target.value) }}
                autoComplete="off"
                style={{ ...inputStyle, paddingRight: selected ? '2.5rem' : undefined }}
              />
              {selected && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="清除學校選擇"
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '1rem', color: '#555', padding: 0,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <ul style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                border, background: '#fff', zIndex: 50,
                margin: 0, padding: 0, listStyle: 'none',
                maxHeight: 240, overflowY: 'auto',
              }}>
                {results.map((s) => (
                  <li
                    key={s.school_code}
                    onClick={() => handleSelect(s)}
                    style={{
                      padding: '0.6rem 0.875rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #e5e5e5',
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <span style={{ fontWeight: 600 }}>{s.school_name}</span>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      {s.school_code} · {s.city}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Hidden fields carrying selected school data to the Server Action */}
          <input type="hidden" name="school_name" value={selected?.school_name ?? ''} />
          <input type="hidden" name="school_code" value={selected?.school_code ?? ''} />
          <input type="hidden" name="city"        value={selected?.city ?? ''} />

          {/* City (auto-filled, read-only) */}
          <div>
            <label style={labelStyle}>縣市</label>
            <input
              type="text"
              readOnly
              value={selected?.city ?? ''}
              placeholder="選擇學校後自動帶出"
              style={{ ...inputStyle, background: '#f9f9f9', color: selected ? '#000' : '#999' }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="teacher@school.edu.tw"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>密碼（至少 8 位）*</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending || !selected}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              border,
              background: pending || !selected ? '#e5e5e5' : '#000',
              color:  pending || !selected ? '#999' : '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: pending || !selected ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {pending ? '處理中…' : '建立帳號'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', textAlign: 'center', color: '#555' }}>
          已有帳號？{' '}
          <Link href="/login" style={{ color: '#000', fontWeight: 600 }}>
            登入
          </Link>
        </p>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 600,
  marginBottom: '0.375rem',
  letterSpacing: '0.01em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1.5px solid #000',
  background: '#fff',
  fontSize: '0.9375rem',
  outline: 'none',
  appearance: 'none',
}
