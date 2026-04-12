import { createClient } from '@supabase/supabase-js'
import { SchoolRegistry } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * 模糊搜尋學校註冊表中的學校名稱
 * @param query 搜尋關鍵字
 * @param limit 最多回傳筆數，預設 10
 * @returns 符合條件的學校列表
 */
export async function searchSchools(
  query: string,
  limit: number = 10
): Promise<{ data: SchoolRegistry[] | null; error: any }> {
  try {
    if (!query.trim()) {
      // 如果搜尋關鍵字為空，回傳空結果
      return { data: [], error: null }
    }

    const { data, error } = await supabase
      .from('school_registry')
      .select('*')
      .or(`school_name.ilike.%${query}%,school_code.ilike.%${query}%`)
      .eq('is_active', true)
      .order('school_name')
      .limit(limit)

    return { data, error }
  } catch (error) {
    console.error('Error searching schools:', error)
    return { data: null, error }
  }
}

/**
 * 根據學校代碼取得學校資訊
 * @param schoolCode 學校代碼
 * @returns 學校資訊
 */
export async function getSchoolByCode(schoolCode: string): Promise<{ data: SchoolRegistry | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('school_registry')
      .select('*')
      .eq('school_code', schoolCode)
      .eq('is_active', true)
      .single()

    return { data, error }
  } catch (error) {
    console.error('Error getting school by code:', error)
    return { data: null, error }
  }
}

/**
 * 取得所有活躍的學校列表
 * @param limit 最多回傳筆數，預設 100
 * @returns 所有活躍學校列表
 */
export async function getAllActiveSchools(limit: number = 100): Promise<{ data: SchoolRegistry[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('school_registry')
      .select('*')
      .eq('is_active', true)
      .order('school_name')
      .limit(limit)

    return { data, error }
  } catch (error) {
    console.error('Error getting all active schools:', error)
    return { data: null, error }
  }
}
