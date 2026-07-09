'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PillButton } from '@/components/ui/PillButton'
import Link from 'next/link'

interface Stats {
  latestWeight: number | null
  totalExercise: number
  todayCalories: number
  streak: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    latestWeight: null,
    totalExercise: 0,
    todayCalories: 0,
    streak: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [weightRes, exerciseRes, dietRes] = await Promise.all([
          fetch('/api/weight'),
          fetch('/api/exercise'),
          fetch('/api/diet'),
        ])

        const weights = weightRes.ok ? await weightRes.json() : []
        const exercises = exerciseRes.ok ? await exerciseRes.json() : []
        const diets = dietRes.ok ? await dietRes.json() : []

        const today = new Date().toDateString()
        const todayDiet = diets.filter((d: any) => new Date(d.date).toDateString() === today)
        const todayExercise = exercises.filter((e: any) => new Date(e.date).toDateString() === today)

        setStats({
          latestWeight: weights[0]?.weight || null,
          totalExercise: todayExercise.reduce((sum: number, e: any) => sum + e.duration, 0),
          todayCalories: todayDiet.reduce((sum: number, d: any) => sum + d.calories, 0),
          streak: 7,
        })
      } catch {
        // 使用默认值
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: '今日体重',
      value: stats.latestWeight ? `${stats.latestWeight} kg` : '--',
      icon: '⚖',
      color: 'text-gold',
      link: '/record?tab=weight',
    },
    {
      title: '今日运动',
      value: `${stats.totalExercise} 分钟`,
      icon: '☯',
      color: 'text-pine',
      link: '/record?tab=exercise',
    },
    {
      title: '今日摄入',
      value: `${stats.todayCalories} kcal`,
      icon: '🍵',
      color: 'text-ochre',
      link: '/record?tab=diet',
    },
    {
      title: '坚持天数',
      value: `${stats.streak} 天`,
      icon: '🔥',
      color: 'text-cinnabar',
      link: '/insights',
    },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-serif text-3xl lg:text-4xl text-paper-base mb-2">
          欢迎回来
        </h1>
        <p className="text-moon/60 font-serif">太极生两仪，两仪生四象，持之以恒，方得始终</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.link}>
              <Card className="cursor-pointer hover:border-gold/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-moon/60 text-sm font-serif mb-1">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {loading ? '--' : stat.value}
                    </p>
                  </div>
                  <span className="text-3xl opacity-50">{stat.icon}</span>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-10"
      >
        <h2 className="font-serif text-xl text-paper-base mb-4">快速记录</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/record?tab=weight">
            <PillButton variant="secondary">记录体重</PillButton>
          </Link>
          <Link href="/record?tab=diet">
            <PillButton variant="secondary">记录饮食</PillButton>
          </Link>
          <Link href="/record?tab=exercise">
            <PillButton variant="secondary">记录运动</PillButton>
          </Link>
          <Link href="/record?tab=dimension">
            <PillButton variant="ghost">记录维度</PillButton>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-serif text-xl text-paper-base mb-4">今日打卡</h2>
        <Card>
          <div className="space-y-4">
            {[
              { label: '晨间称重', done: stats.latestWeight !== null, time: '07:00' },
              { label: '早餐记录', done: false, time: '08:00' },
              { label: '运动打卡', done: stats.totalExercise > 0, time: '19:00' },
              { label: '睡前总结', done: false, time: '21:00' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.done ? 'bg-pine border-pine' : 'border-moon/30'
                  }`}>
                    {item.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={item.done ? 'text-moon/40 line-through' : 'text-paper-base'}>
                    {item.label}
                  </span>
                </div>
                <span className="text-moon/40 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
