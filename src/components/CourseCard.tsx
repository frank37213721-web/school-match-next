interface Course {
  id: string
  title: string
  description?: string
  course_type?: string
  host_school_id: string
  schools?: {
    name: string
  }
}

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white border-[1.5px] border-[#1a1a1a] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {course.title}
      </h3>
      
      {course.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <span>🏫</span>
          {course.schools?.name || '未知學校'}
        </span>
        
        {course.course_type && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {course.course_type}
          </span>
        )}
      </div>
    </div>
  )
}

export type { Course }
