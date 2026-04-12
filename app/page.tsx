export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-2xl mx-auto text-center px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          課程匯流平台
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          連結學校，分享知識，創造無限可能
        </p>
        <div className="bg-gray-50 border-[1.5px] border-[#1a1a1a] rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            歡迎來到未來的教育生態系
          </h2>
          <p className="text-gray-600 leading-relaxed">
            我們致力於打造一個開放、共享的跨校課程交流平台，
            讓每個學校都能分享優質課程，讓每個學生都能接觸更豐富的學習資源。
          </p>
        </div>
      </div>
    </div>
  )
}
