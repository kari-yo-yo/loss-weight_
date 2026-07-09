import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/nav/Sidebar'
import { AuthProvider } from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: '太极养生 - 您的养生减肥伴侣',
  description: '以太极、走路、八段锦等温和运动为核心的养生减肥追踪平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="ink-texture"
        style={{
          ['--font-noto-sans' as string]: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
          ['--font-noto-serif' as string]: "'Noto Serif SC', 'Songti SC', 'SimSun', serif",
          ['--font-ma-shan-zheng' as string]: "'Ma Shan Zheng', 'KaiTi', cursive",
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
