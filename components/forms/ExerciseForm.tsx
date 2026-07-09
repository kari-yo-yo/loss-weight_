'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PillButton } from '@/components/ui/PillButton'

const exerciseTypes = [
  { id: 'TAIJI', label: '太极拳', icon: '☯' },
  { id: 'WALKING', label: '走路', icon: '🚶' },
  { id: 'BADUANJIN', label: '八段锦', icon: '🧘' },
  { id: 'OTHER', label: '其他', icon: '✦' },
]

export function ExerciseForm() {
  const [type, setType] = useState('TAIJI')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [note, setNote] = useState('')
  const [records, setRecords] = useState<any[]>([])
  const [showStamp, setShowStamp] = useState(false)

  const fetchRecords = async () => {
    const res = await fetch('/api/exercise')
    if (res.ok) {
      const data = await res.json()
      setRecords(data.slice(0, 10))
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/exercise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        duration: parseInt(duration),
        calories: calories ? parseInt(calories) : null,
        note,
        date: new Date().toISOString(),
      }),
    })

    if (res.ok) {
      setShowStamp(true)
      setTimeout(() => setShowStamp(false), 2000)
      setDuration('')
      setCalories('')
      setNote('')
      fetchRecords()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">记录今日运动</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-moon/60 mb-2 font-serif">运动类型</label>
            <div className="flex gap-2 flex-wrap">
              {exerciseTypes.map((et) => (
                <button
                  key={et.id}
                  type="button"
                  onClick={() => setType(et.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    type === et.id
                      ? 'bg-cinnabar text-paper-base'
                      : 'bg-white/5 text-moon/60 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-1">{et.icon}</span>
                  {et.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-moon/60 mb-2 font-serif">时长 (分钟)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-moon/60 mb-2 font-serif">消耗 (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
                placeholder="150"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-moon/60 mb-2 font-serif">备注</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
              placeholder="晨练太极，气感明显"
            />
          </div>
          <div className="relative">
            <PillButton className="w-full">
              <span className="mr-2">✓</span>确认打卡
            </PillButton>
            <AnimatePresence>
              {showStamp && (
                <motion.div
                  initial={{ opacity: 0, y: -100, rotate: -15 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-4 right-10 w-24 h-24 border-4 border-pine rounded-full flex items-center justify-center"
                >
                  <span className="font-calligraphy text-pine text-2xl">已打卡</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">今日运动</h3>
        <div className="space-y-3">
          {records.map((record: any) => (
            <div key={record.id} className="flex justify-between items-center py-3 border-b border-white/5">
              <div>
                <span className="text-paper-base">
                  {exerciseTypes.find(e => e.id === record.type)?.label}
                </span>
                <span className="text-moon/60 text-sm ml-2">{record.duration} 分钟</span>
              </div>
              {record.calories && (
                <span className="text-pine font-bold">{record.calories} kcal</span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
