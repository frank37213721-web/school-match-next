'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import CourseCard, { Course } from '@/components/CourseCard'

export default function CourseLobby() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            schools (
              name
            )
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching courses:', error)
          return
        }

        setCourses(data || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">讀取中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">課程大廳</h1>
        <p className="text-gray-600">探索所有學校的精選課程</p>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            目前沒有任何課程
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
