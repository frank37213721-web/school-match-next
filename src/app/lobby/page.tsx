import { supabase } from '@/lib/supabase'
import CourseCard, { Course } from '@/components/course/CourseCard'
import Sidebar from '@/components/layout/Sidebar'

export const dynamic = 'force-dynamic'

type FetchResult =
  | { ok: true;  courses: Course[] }
  | { ok: false; message: string }

async function getCourses(): Promise<FetchResult> {
  // Guard: catch missing / placeholder env vars before hitting the network
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!url || url.includes('_url_here') || !key || key.includes('_key_here')) {
    return {
      ok: false,
      message: '.env.local 的 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY 尚未填入真實值。',
    }
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        course_type,
        outline,
        requirements,
        start_time,
        end_time,
        max_students,
        current_students,
        is_open,
        host_school_id,
        created_at,
        schools ( id, name )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[lobby] Supabase error:', JSON.stringify(error))
      return {
        ok: false,
        message: error.message || `Supabase 查詢失敗（code: ${error.code ?? '未知'}）`,
      }
    }

    return { ok: true, courses: (data ?? []) as unknown as Course[] }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[lobby] Unexpected error:', msg)
    return { ok: false, message: `連線發生例外：${msg}` }
  }
}

export default async function LobbyPage() {
  const result = await getCourses()

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">課程大廳</h2>
            {result.ok && (
              <p className="text-sm text-gray-500 mt-1">共 {result.courses.length} 門課程</p>
            )}
          </div>

          {/* Error state */}
          {!result.ok && (
            <div className="border border-red-300 bg-red-50 rounded-lg p-6 text-sm text-red-700">
              <p className="font-semibold mb-1">連線失敗</p>
              <p>{result.message}</p>
              <p className="mt-3 text-xs text-red-500">
                請確認 <code>.env.local</code> 已填入正確的 Supabase URL 與 Anon Key，並重新啟動開發伺服器。
              </p>
            </div>
          )}

          {/* Empty state */}
          {result.ok && result.courses.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-base">目前尚無課程</p>
              <p className="text-sm mt-1">請至 Supabase Dashboard 的 courses 資料表新增資料</p>
            </div>
          )}

          {/* Course list */}
          {result.ok && result.courses.length > 0 && (
            <div className="flex flex-col gap-5">
              {result.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
