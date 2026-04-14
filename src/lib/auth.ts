import bcrypt from 'bcryptjs'
import { supabase } from './supabase'
import { School } from '@/types/database'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function findSchoolByPhone(phone: string): Promise<School | null> {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error) {
      console.error('Error finding school by phone:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function createSchoolAccount(schoolData: {
  name: string
  phone: string
  password: string
  contact_person?: string
  extension?: string
  director_email?: string
  principal_email?: string
  role?: 'user' | 'admin'
}): Promise<{ success: boolean; error?: string; data?: School }> {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(schoolData.password)

    // Insert school record
    const { data, error } = await supabase
      .from('schools')
      .insert({
        name: schoolData.name,
        phone: schoolData.phone,
        password: hashedPassword,
        contact_person: schoolData.contact_person,
        extension: schoolData.extension,
        director_email: schoolData.director_email,
        principal_email: schoolData.principal_email,
        role: schoolData.role || 'user'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating school account:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: '創建帳號失敗' }
  }
}

export async function authenticateSchool(phone: string, password: string): Promise<{ success: boolean; error?: string; school?: School }> {
  try {
    // Find school by phone
    const school = await findSchoolByPhone(phone)
    
    if (!school) {
      return { success: false, error: '找不到此學校帳號' }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, school.password || '')
    
    if (!isValidPassword) {
      return { success: false, error: '密碼錯誤' }
    }

    // Remove password from returned data
    const { password: _, ...schoolWithoutPassword } = school
    
    return { success: true, school: schoolWithoutPassword as School }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, error: '登入失敗' }
  }
}
