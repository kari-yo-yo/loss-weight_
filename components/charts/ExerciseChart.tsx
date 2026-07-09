'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { motion } from 'framer-motion'

interface ExerciseData {
  type: string
  duration: number
  calories: number
  count: number
}

const TYPE_LABELS: Record<string, string> = {
  taichi: '太极',
  walking: '走路',
  baduanjin: '八段锦',
  other: '其他',
}

const TYPE_COLORS: Record<string, string> = {
  taichi: '#4a7c59',
  walking: '#2c5f7c',
  baduanjin: '#a0522d',
  other: '#6b5b73',
}

interface ExerciseChartProps {
  days?: number
}

export function ExerciseChart({ days = 7 }: ExerciseChartProps) {
  const [data, setData] = useState<ExerciseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/exercise?days=${days}`)
      .then((res) => res.json())
      .then((records: any[]) => {
        const grouped: Record<string, { duration: number; calories: number; count: number }> = {}

        records.forEach((r) => {
          const type = r.type || 'other'
          if (!grouped[type]) {
            grouped[type] = { duration: 0, calories: 0, count: 0 }
          }
          grouped[type].duration += r.duration || 0
          grouped[type].calories += r.calories || 0
          grouped[type].count += 1
        })

        const formatted = Object.entries(grouped).map(([type, stats]) => ({
          type: TYPE_LABELS[type] || type,
          duration: stats.duration,
          calories: stats.calories,
          count: stats.count,
        }))

        setData(formatted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [days])

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gold/50 font-serif"
        >
          数据加载中...
        </motion.div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-foreground/40 font-serif text-sm">暂无运动记录</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-outer p-1">
          <div className="card-inner px-4 py-3">
            <p className="text-foreground/70 text-xs mb-1">{label}</p>
            <p className="text-pine font-medium">时长: {payload[0].value} 分钟</p>
            <p className="text-ochre text-xs mt-1">
              消耗: {payload[0].payload.calories} 千卡
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="type"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(242, 237, 228, 0.5)', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(242, 237, 228, 0.4)', fontSize: 11 }}
            tickFormatter={(v) => `${v}分`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="duration" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => {
              const key = Object.keys(TYPE_LABELS).find(
                (k) => TYPE_LABELS[k] === entry.type
              ) || 'other'
              return <Cell key={`cell-${index}`} fill={TYPE_COLORS[key] || '#4a7c59'} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
