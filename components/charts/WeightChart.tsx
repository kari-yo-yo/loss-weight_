'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { motion } from 'framer-motion'

interface WeightData {
  date: string
  weight: number
  bodyFat?: number | null
}

interface WeightChartProps {
  days?: number
}

export function WeightChart({ days = 30 }: WeightChartProps) {
  const [data, setData] = useState<WeightData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/weight?days=${days}`)
      .then((res) => res.json())
      .then((records) => {
        const formatted = records.map((r: any) => ({
          date: new Date(r.recordedAt).toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
          }),
          weight: r.weight,
          bodyFat: r.bodyFat,
        }))
        setData(formatted.reverse())
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
        <p className="text-foreground/40 font-serif text-sm">暂无体重记录</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-outer p-1">
          <div className="card-inner px-4 py-3">
            <p className="text-foreground/70 text-xs mb-1">{label}</p>
            <p className="text-cinnabar font-medium">
              体重: {payload[0].value} kg
            </p>
            {payload[0].payload.bodyFat && (
              <p className="text-pine text-xs mt-1">
                体脂: {payload[0].payload.bodyFat}%
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bf3b3b" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#bf3b3b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(242, 237, 228, 0.4)', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(242, 237, 228, 0.4)', fontSize: 11 }}
            domain={['dataMin - 1', 'dataMax + 1']}
            tickFormatter={(v) => `${v}kg`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#bf3b3b"
            strokeWidth={2}
            fill="url(#weightGradient)"
            dot={{ fill: '#bf3b3b', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#bf3b3b', stroke: '#f2ede4', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
