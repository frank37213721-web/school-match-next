'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// TypeScript Interfaces for Supabase data
export interface School {
  id: string
  name: string
  created_at?: string
}

export interface Course {
  id: string
  title: string
  description?: string
  course_type: 'lecture' | 'lab' | 'seminar' | 'workshop' | 'other'
  outline?: string
  requirements?: string
  start_time?: string
  end_time?: string
  max_students?: number
  current_students?: number
  is_open: boolean
  host_school_id: string
  created_at?: string
  schools?: School
}

interface CourseCardProps {
  course: Course
}

// Color mapping for course types
const courseTypeColors = {
  lecture: '#3B82F6', // blue-500
  lab: '#10B981', // emerald-500
  seminar: '#F59E0B', // amber-500
  workshop: '#EF4444', // red-500
  other: '#6B7280' // gray-500
}

const courseTypeLabels = {
  lecture: '講座',
  lab: '實驗',
  seminar: '研討會',
  workshop: '工作坊',
  other: '其他'
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const colorBar = courseTypeColors[course.course_type] || courseTypeColors.other
  const courseTypeLabel = courseTypeLabels[course.course_type] || courseTypeLabels.other

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white border-[1.5px] border-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Left color bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ backgroundColor: colorBar }}
      />
      
      {/* Main content */}
      <div className="pl-8 pr-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {course.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="text-base">🏫</span>
                {course.schools?.name || '未知學校'}
              </span>
              {course.start_time && (
                <span className="flex items-center gap-1">
                  <span className="text-base">🕐</span>
                  {course.start_time}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span 
              className="px-3 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: colorBar }}
            >
              {courseTypeLabel}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              course.is_open 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {course.is_open ? '開放報名' : '已額滿'}
            </span>
          </div>
        </div>
        
        {/* Description */}
        {course.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}
        
        {/* Student count */}
        {course.max_students && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>👥</span>
            <span>
              {course.current_students || 0} / {course.max_students} 人
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((course.current_students || 0) / course.max_students * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}
        
        {/* Details button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          <span>詳情</span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ⌄
          </motion.span>
        </button>
      </div>
      
      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-200"
          >
            <div className="p-6 pt-0">
              <div className="pt-6 space-y-4">
                {/* Course Outline */}
                {course.outline && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>📋</span>
                      課程大綱
                    </h4>
                    <div className="text-gray-700 text-sm whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                      {course.outline}
                    </div>
                  </div>
                )}
                
                {/* Requirements */}
                {course.requirements && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span>✅</span>
                      修課要求
                    </h4>
                    <div className="text-gray-700 text-sm whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                      {course.requirements}
                    </div>
                  </div>
                )}
                
                {/* Additional info */}
                <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                  <span>課程 ID: {course.id}</span>
                  <span>開課學校 ID: {course.host_school_id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
