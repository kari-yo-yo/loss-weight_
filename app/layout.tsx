import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Sidebar } from '@/components/nav/Sidebar'
import { AuthProvider } from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: '太极养生 - 您的养生减肥伴侣',
  description: '以太极、走路、八段锦等温和运动为核心的养生减肥追踪平台',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body
        className="ink-texture"
        style={{
          ['--font-noto-sans' as string]: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
          ['--font-noto-serif' as string]: "'Songti SC', 'SimSun', 'Noto Serif SC', serif",
          ['--font-ma-shan-zheng' as string]: "'KaiTi', 'STKaiti', 'Ma Shan Zheng', cursive",
        }}
      >
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-0 lg:ml-64 transition-all duration-500">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}