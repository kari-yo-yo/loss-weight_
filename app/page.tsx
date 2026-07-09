'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PillButton } from '@/components/ui/PillButton'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [height, setHeight] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (isLogin) {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('用户名或密码错误')
        setIsLoading(false)
      } else {
        router.push('/dashboard')
      }
    } else {
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            targetWeight: targetWeight ? parseFloat(targetWeight) : null,
            height: height ? parseFloat(height) : null,
          }),
        })

        if (res.ok) {
          await signIn('credentials', {
            username,
            password,
            redirect: false,
          })
          router.push('/dashboard')
        } else {
          const data = await res.json()
          setError(data.error || '注册失败')
          setIsLoading(false)
        }
      } catch {
        setError('注册失败')
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 水墨山水背景 */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1200 800" className="w-full h-full">
          <defs>
            <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f2ede4" />
              <stop offset="100%" stopColor="#0f0f14" />
            </linearGradient>
          </defs>
          <path d="M0,600 Q200,400 400,550 T800,450 T1200,500 L1200,800 L0,800 Z" fill="url(#mountainGrad)" />
          <path d="M0,650 Q300,500 600,600 T1200,550 L1200,800 L0,800 Z" fill="url(#mountainGrad)" opacity="0.5" />
        </svg>
      </div>

      {/* 云雾飘移动画 */}
      <motion.div
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 left-10 w-64 h-32 bg-gradient-to-r from-moon/5 to-transparent rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.h1
            className="font-calligraphy text-5xl text-gold mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            太极养生
          </motion.h1>
          <p className="font-serif text-moon/60 text-sm">以静制动 · 修身养性</p>
        </div>

        {/* 表单卡片 */}
        <div className="card-outer">
          <div className="card-inner p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block font-serif text-sm text-moon/70 mb-2">用户名</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none transition-colors"
                    placeholder="请输入用户名"
                    required
                  />
                </div>

                <div>
                  <label className="block font-serif text-sm text-moon/70 mb-2">密码</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none transition-colors"
                    placeholder="请输入密码"
                    required
                  />
                </div>

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block font-serif text-sm text-moon/70 mb-2">目标体重 (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none transition-colors"
                        placeholder="例如: 65"
                      />
                    </div>
                    <div>
                      <label className="block font-serif text-sm text-moon/70 mb-2">身高 (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none transition-colors"
                        placeholder="例如: 170"
                      />
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-cinnabar text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <PillButton className="w-full">
                  {isLoading ? '请稍候...' : isLogin ? '登 录' : '注 册'}
                </PillButton>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError('') }}
                className="text-moon/50 hover:text-gold text-sm transition-colors"
              >
                {isLogin ? '还没有账号？立即注册' : '已有账号？立即登录'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
