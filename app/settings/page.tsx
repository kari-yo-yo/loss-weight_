'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface UserProfile {
  username: string
  targetWeight?: number | null
  height?: number | null
  createdAt: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ targetWeight: '', height: '' })
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    if (session?.user?.name) {
      fetch('/api/user')
        .then((r) => r.json())
        .then((data) => {
          setProfile(data)
          setForm({
            targetWeight: data.targetWeight?.toString() || '',
            height: data.height?.toString() || '',
          })
        })
    }
  }, [session])

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWeight: form.targetWeight ? parseFloat(form.targetWeight) : null,
          height: form.height ? parseFloat(form.height) : null,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setProfile(updated)
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-[100dvh] p-6 md:p-8 lg:p-10">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="font-calligraphy text-3xl text-gold/60">鹤</span>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">
            个人设置
          </h1>
        </div>
        <p className="text-foreground/40 text-sm font-serif ml-12">
          修身养性，从心开始
        </p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* 用户信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gold/60 rounded-full" />
              <h2 className="text-lg font-serif text-foreground">个人信息</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-foreground/50 text-sm font-serif">用户名</span>
                <span className="text-foreground font-medium">{profile?.username || session?.user?.name || '--'}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-foreground/50 text-sm font-serif">注册时间</span>
                <span className="text-foreground/70 text-sm">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('zh-CN')
                    : '--'}
                </span>
              </div>

              {editing ? (
                <>
                  <div className="space-y-2">
                    <label className="text-foreground/50 text-sm font-serif">目标体重 (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.targetWeight}
                      onChange={(e) => setForm((f) => ({ ...f, targetWeight: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/30 focus:outline-none focus:border-gold/30 transition-colors"
                      placeholder="设定目标体重"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground/50 text-sm font-serif">身高 (cm)</label>
                    <input
                      type="number"
                      value={form.height}
                      onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/30 focus:outline-none focus:border-gold/30 transition-colors"
                      placeholder="输入身高"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 btn-pill text-center disabled:opacity-50"
                    >
                      {saving ? '保存中...' : '保存'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 px-6 py-3 rounded-full font-medium border border-white/10 text-foreground/60 hover:bg-white/5 transition-all"
                    >
                      取消
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-foreground/50 text-sm font-serif">目标体重</span>
                    <span className="text-foreground/70">
                      {profile?.targetWeight ? `${profile.targetWeight} kg` : '未设置'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-foreground/50 text-sm font-serif">身高</span>
                    <span className="text-foreground/70">
                      {profile?.height ? `${profile.height} cm` : '未设置'}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full mt-4 px-6 py-3 rounded-full font-medium border border-white/10 text-foreground/60 hover:bg-white/5 hover:text-foreground/80 transition-all text-sm"
                  >
                    编辑信息
                  </button>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* 外观设置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card delay={0.1}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-indigo/60 rounded-full" />
              <h2 className="text-lg font-serif text-foreground">外观</h2>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <span className="text-foreground font-medium text-sm block">主题模式</span>
                <span className="text-foreground/40 text-xs">
                  {theme === 'dark' ? '墨色深沉，夜观数据' : '纸白墨清，昼览身形'}
                </span>
              </div>
              <button
                onClick={handleThemeToggle}
                className="relative w-14 h-8 rounded-full transition-colors duration-500 border"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-calligraphy"
                  style={{
                    backgroundColor: theme === 'dark' ? '#1a1a24' : '#ffffff',
                    color: theme === 'dark' ? '#f2ede4' : '#0f0f14',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                  animate={{ left: theme === 'dark' ? '4px' : '30px' }}
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                >
                  {theme === 'dark' ? '墨' : '纸'}
                </motion.div>
              </button>
            </div>
          </Card>
        </motion.div>

        {/* 账户操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-cinnabar/60 rounded-full" />
              <h2 className="text-lg font-serif text-foreground">账户</h2>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full px-6 py-3 rounded-xl font-medium border border-cinnabar/20 text-cinnabar hover:bg-cinnabar/10 transition-all text-sm"
            >
              退出登录
            </button>
          </Card>
        </motion.div>

        {/* 版本信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center pt-4"
        >
          <p className="text-foreground/20 text-xs font-serif">太极养生 · 乙巳年</p>
          <p className="text-foreground/15 text-xs mt-1">v1.0.0</p>
        </motion.div>
      </div>
    </div>
  )
}
