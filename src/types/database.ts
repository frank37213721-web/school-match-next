// Database type definitions for Supabase tables

export type UserRole = 'user' | 'admin'

export type CourseType = 'lecture' | 'lab' | 'seminar' | 'workshop' | 'other'

export interface School {
  id: string
  name: string
  role: UserRole
  email?: string
  phone?: string
  address?: string
  contact_person?: string
  created_at?: string
  updated_at?: string
}

export interface SchoolRegistry {
  id: string
  school_code: string
  school_name: string
  district?: string
  city?: string
  county?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface Course {
  id: string
  title: string
  description?: string
  course_type: CourseType
  outline?: string
  requirements?: string
  start_time?: string
  end_time?: string
  max_students?: number
  current_students?: number
  is_open: boolean
  host_school_id: string
  created_at?: string
  updated_at?: string
  
  // Joined relations
  schools?: School
  matches?: Match[]
}

export interface Match {
  id: string
  course_id: string
  partner_school_id: string
  status: 'pending' | 'accepted' | 'rejected'
  partner_notes?: string
  host_notes?: string
  created_at?: string
  updated_at?: string
  
  // Joined relations
  courses?: Course
  partner_schools?: School
  host_schools?: School
}

// Database table types for Supabase
export interface Database {
  public: {
    Tables: {
      schools: {
        Row: School
        Insert: Omit<School, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<School, 'id' | 'created_at' | 'updated_at'>>
      }
      school_registry: {
        Row: SchoolRegistry
        Insert: Omit<SchoolRegistry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SchoolRegistry, 'id' | 'created_at' | 'updated_at'>>
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Match, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

// Export types for convenience
export type { School as SchoolType, Course as CourseRow, Match as MatchType, SchoolRegistry as SchoolRegistryType }
