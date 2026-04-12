export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            課程匯流平台
          </h1>
          <p className="text-sm text-gray-600">
            跨校課程交流與合作
          </p>
        </div>
      </div>
      
      <div className="px-4 pb-4 border-t border-gray-200 pt-4">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </div>
    </div>
  )
}
