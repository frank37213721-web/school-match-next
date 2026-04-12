import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '選校媒合平台',
  description: '高中職課程媒合系統',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
