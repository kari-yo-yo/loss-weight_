'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { WeightChart } from '@/components/charts/WeightChart'
import { ExerciseChart } from '@/components/charts/ExerciseChart'
import { DietChart } from '@/components/charts/DietChart'

const TIME_RANGES = [
  { label: '近七日', value: 7, description: '七日流转，见微知著' },
  { label: '近三十日', value: 30, description: '一月之期，察势观变' },
]

export default function InsightsPage() {
  const [days, setDays] = useState(7)

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
          <span className="font-calligraphy text-3xl text-gold/60">竹</span>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">
            数据洞察
          </h1>
        </div>
        <p className="text-foreground/40 text-sm font-serif ml-12">
          观数据之流转，知身体之变化
        </p>
      </motion.div>

      {/* 时间范围选择器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-3">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setDays(range.value)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${
                days === range.value
                  ? 'bg-cinnabar/20 text-cinnabar border border-cinnabar/30'
                  : 'bg-white/5 text-foreground/50 border border-white/5 hover:bg-white/10 hover:text-foreground/70'
              }`}
            >
              <span className="relative z-10">{range.label}</span>
              {days === range.value && (
                <motion.div
                  layoutId="activeTimeRange"
                  className="absolute inset-0 rounded-full bg-cinnabar/10 border border-cinnabar/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
        <p className="text-foreground/30 text-xs mt-3 font-serif">
          {TIME_RANGES.find((r) => r.value === days)?.description}
        </p>
      </motion.div>

      {/* 图表区域 */}
      <div className="space-y-6">
        {/* 体重趋势 - 全宽 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-cinnabar/60 rounded-full" />
                <h2 className="text-lg font-serif text-foreground">体重趋势</h2>
              </div>
              <span className="text-foreground/30 text-xs font-serif">
                {days === 7 ? '七日变化' : '三十日变化'}
              </span>
            </div>
            <WeightChart days={days} />
          </Card>
        </motion.div>

        {/* 运动与饮食 - 并排 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 运动统计 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card delay={0.1}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-pine/60 rounded-full" />
                  <h2 className="text-lg font-serif text-foreground">运动统计</h2>
                </div>
                <span className="text-foreground/30 text-xs font-serif">
                  按类型汇总
                </span>
              </div>
              <ExerciseChart days={days} />
            </Card>
          </motion.div>

          {/* 饮食分布 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card delay={0.2}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gold/60 rounded-full" />
                  <h2 className="text-lg font-serif text-foreground">饮食分布</h2>
                </div>
                <span className="text-foreground/30 text-xs font-serif">
                  热量占比
                </span>
              </div>
              <DietChart days={days} />
            </Card>
          </motion.div>
        </div>

        {/* 数据汇总卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <InsightSummary days={days} />
        </motion.div>
      </div>
    </div>
  )
}

function InsightSummary({ days }: { days: number }) {
  const [stats, setStats] = useState({
    weightChange: null as number | null,
    totalExercise: 0,
    totalCalories: 0,
    avgDailyCalories: 0,
  })

  useEffect(() => {
    // 重置状态
    setStats({
      weightChange: null,
      totalExercise: 0,
      totalCalories: 0,
      avgDailyCalories: 0,
    })

    // 获取体重变化
    fetch(`/api/weight?days=${days}`)
      .then((r) => r.json())
      .then((records) => {
        if (records.length >= 2) {
          const latest = records[0].weight
          const earliest = records[records.length - 1].weight
          setStats((s) => ({ ...s, weightChange: latest - earliest }))
        }
      })

    // 获取运动总量
    fetch(`/api/exercise?days=${days}`)
      .then((r) => r.json())
      .then((records) => {
        const total = records.reduce((sum: number, r: any) => sum + (r.duration || 0), 0)
        setStats((s) => ({ ...s, totalExercise: total }))
      })

    // 获取饮食热量
    fetch(`/api/diet?days=${days}`)
      .then((r) => r.json())
      .then((records) => {
        const total = records.reduce((sum: number, r: any) => sum + (r.calories || 0), 0)
        setStats((s) => ({
          ...s,
          totalCalories: total,
          avgDailyCalories: days > 0 ? Math.round(total / days) : 0,
        }))
      })
  }, [days])

  return (
    <Card delay={0.3}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-indigo/60 rounded-full" />
        <h2 className="text-lg font-serif text-foreground">周期汇总</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryItem
          label="体重变化"
          value={
            stats.weightChange !== null
              ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg`
              : '--'
          }
          color={stats.weightChange !== null && stats.weightChange <= 0 ? 'text-pine' : 'text-cinnabar'}
        />
        <SummaryItem
          label="运动时长"
          value={`${stats.totalExercise} 分钟`}
          color="text-pine"
        />
        <SummaryItem
          label="摄入热量"
          value={`${stats.totalCalories} 千卡`}
          color="text-gold"
        />
        <SummaryItem
          label="日均摄入"
          value={`${stats.avgDailyCalories} 千卡`}
          color="text-ochre"
        />
      </div>
    </Card>
  )
}

function SummaryItem({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <p className="text-foreground/40 text-xs font-serif mb-1">{label}</p>
      <p className={`text-lg font-medium ${color}`}>{value}</p>
    </div>
  )
}
