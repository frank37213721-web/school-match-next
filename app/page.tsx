'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Course {
  id: string
  title: string
  host_school_id: string
  schools?: {
    name: string
  }
}

export default function CourseLobby() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            host_school_id,
            schools (
              name
            )
          `)
          .limit(3)

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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          📚 跨校課程匯流平台 - 課程大廳
        </h1>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              目前沒有任何課程
            </div>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white border-[1.5px] border-[#1a1a1a] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600">
                開課學校：{course.schools?.name || '未知學校'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
