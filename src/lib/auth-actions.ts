'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'

export type AuthState = {
  error?: string
  message?: string
} | undefined

// ---------------------------------------------------------------------------
// Sign Up
// ---------------------------------------------------------------------------
export async function signUp(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email       = (formData.get('email') as string)?.trim()
  const password    = formData.get('password') as string
  const school_name = (formData.get('school_name') as string)?.trim()
  const school_code = (formData.get('school_code') as string)?.trim()
  const city        = (formData.get('city') as string)?.trim()

  if (!email || !password || !school_name || !school_code) {
    return { error: '請填寫所有必填欄位，並選擇學校。' }
  }
  if (password.length < 8) {
    return { error: '密碼至少需要 8 個字元。' }
  }

  const supabase = await createServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        school_name,
        school_code,
        city: city ?? '',
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: '此 Email 已被註冊，請直接登入。' }
    }
    return { error: error.message }
  }

  return { message: '註冊成功！請至信箱確認驗證信後再登入。' }
}

// ---------------------------------------------------------------------------
// Sign In
// ---------------------------------------------------------------------------
export async function signIn(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '請輸入 Email 與密碼。' }
  }

  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (
      error.message.includes('Invalid login credentials') ||
      error.message.includes('invalid_credentials')
    ) {
      return { error: 'Email 或密碼錯誤，請重試。' }
    }
    return { error: error.message }
  }

  redirect('/dashboard')
}

// ---------------------------------------------------------------------------
// Sign Out
// ---------------------------------------------------------------------------
export async function signOut(): Promise<void> {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
