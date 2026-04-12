'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { name: '課程大廳', href: '/lobby', icon: '🏛️' },
  { name: '學校基本資料', href: '/school-info', icon: '🏫' },
  { name: '新增/修改課程', href: '/courses', icon: '📚' },
  { name: '登出', href: '/logout', icon: '🚪' }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">課程匯流平台</h1>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const isHovered = hoveredItem === item.name
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg
                    transition-all duration-200 ease-in-out
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${isHovered && !isActive ? 'border-l-4 border-gray-300' : ''}
                  `}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </div>
    </div>
  )
}
