'use client'

import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { motion } from 'framer-motion'

interface DietData {
  mealType: string
  calories: number
  count: number
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
}

const MEAL_COLORS: Record<string, string> = {
  breakfast: '#c9a96e',
  lunch: '#bf3b3b',
  dinner: '#4a7c59',
  snack: '#2c5f7c',
}

interface DietChartProps {
  days?: number
}

export function DietChart({ days = 7 }: DietChartProps) {
  const [data, setData] = useState<DietData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/diet?days=${days}`)
      .then((res) => res.json())
      .then((records: any[]) => {
        const grouped: Record<string, { calories: number; count: number }> = {}

        records.forEach((r) => {
          const type = r.mealType || 'snack'
          if (!grouped[type]) {
            grouped[type] = { calories: 0, count: 0 }
          }
          grouped[type].calories += r.calories || 0
          grouped[type].count += 1
        })

        const formatted = Object.entries(grouped).map(([type, stats]) => ({
          mealType: MEAL_LABELS[type] || type,
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
        <p className="text-foreground/40 font-serif text-sm">暂无饮食记录</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="card-outer p-1">
          <div className="card-inner px-4 py-3">
            <p className="text-foreground/70 text-xs mb-1">{item.mealType}</p>
            <p className="text-gold font-medium">热量: {item.calories} 千卡</p>
            <p className="text-foreground/50 text-xs mt-1">
              记录 {item.count} 次
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground/60 text-xs">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="calories"
            stroke="none"
          >
            {data.map((entry, index) => {
              const key = Object.keys(MEAL_LABELS).find(
                (k) => MEAL_LABELS[k] === entry.mealType
              ) || 'snack'
              return <Cell key={`cell-${index}`} fill={MEAL_COLORS[key] || '#c9a96e'} />
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
