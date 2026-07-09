'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: '仪表盘', icon: '山' },
  { href: '/record', label: '记录中心', icon: '水' },
  { href: '/insights', label: '数据洞察', icon: '竹' },
  { href: '/advice', label: '养生建议', icon: '梅' },
  { href: '/settings', label: '个人设置', icon: '鹤' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* 移动端汉堡按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-ink-light/80 backdrop-blur-sm"
      >
        <div className="w-5 h-0.5 bg-gold mb-1.5 transition-all"
          style={{ transform: isOpen ? 'rotate(45deg) translateY(4px)' : 'none' }}
        />
        <div className="w-5 h-0.5 bg-gold mb-1.5 transition-all"
          style={{ opacity: isOpen ? 0 : 1 }}
        />
        <div className="w-5 h-0.5 bg-gold transition-all"
          style={{ transform: isOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }}
        />
      </button>

      {/* 导航栏 */}
      <AnimatePresence>
        {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="scroll-nav fixed left-0 top-0 h-full w-64 z-40 flex flex-col p-6"
          >
            {/* Logo */}
            <div className="mb-12">
              <h1 className="font-calligraphy text-3xl text-gold">太极养生</h1>
              <p className="text-xs text-moon/60 mt-1 font-serif">阴阳平衡 · 身心合一</p>
            </div>

            {/* 导航项 */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-cinnabar/20 text-cinnabar border-l-2 border-cinnabar'
                          : 'text-moon/70 hover:text-gold hover:bg-white/5'
                      }`}
                    >
                      <span className="font-calligraphy text-lg">{item.icon}</span>
                      <span className="font-serif">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* 底部装饰 */}
            <div className="mt-auto pt-6 border-t border-gold/10">
              <div className="w-12 h-12 mx-auto rounded-full border border-gold/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-transparent" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 移动端遮罩 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  )
}
