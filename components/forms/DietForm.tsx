'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PillButton } from '@/components/ui/PillButton'

const mealTypes = [
  { id: 'BREAKFAST', label: '早餐', icon: '🌅' },
  { id: 'LUNCH', label: '午餐', icon: '☀' },
  { id: 'DINNER', label: '晚餐', icon: '🌙' },
  { id: 'EXTRA', label: '加餐', icon: '🍃' },
]

export function DietForm() {
  const [mealType, setMealType] = useState('BREAKFAST')
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [note, setNote] = useState('')
  const [records, setRecords] = useState<any[]>([])
  const [showStamp, setShowStamp] = useState(false)

  const fetchRecords = async () => {
    const res = await fetch('/api/diet')
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

    const res = await fetch('/api/diet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mealType,
        foodName,
        calories: parseInt(calories),
        note,
        date: new Date().toISOString(),
      }),
    })

    if (res.ok) {
      setShowStamp(true)
      setTimeout(() => setShowStamp(false), 2000)
      setFoodName('')
      setCalories('')
      setNote('')
      fetchRecords()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">记录今日饮食</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-moon/60 mb-2 font-serif">餐次</label>
            <div className="flex gap-2 flex-wrap">
              {mealTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setMealType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    mealType === type.id
                      ? 'bg-cinnabar text-paper-base'
                      : 'bg-white/5 text-moon/60 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-moon/60 mb-2 font-serif">食物名称</label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
              placeholder="例如：红豆薏米粥"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-moon/60 mb-2 font-serif">热量 (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
              placeholder="300"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-moon/60 mb-2 font-serif">备注</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
              placeholder=" homemade"
            />
          </div>
          <div className="relative">
            <PillButton className="w-full">
              <span className="mr-2">✓</span>确认记录
            </PillButton>
            <AnimatePresence>
              {showStamp && (
                <motion.div
                  initial={{ opacity: 0, y: -100, rotate: -15 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-4 right-10 w-24 h-24 border-4 border-cinnabar rounded-full flex items-center justify-center"
                >
                  <span className="font-calligraphy text-cinnabar text-2xl">已记录</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">今日饮食</h3>
        <div className="space-y-3">
          {records.map((record: any) => (
            <div key={record.id} className="flex justify-between items-center py-3 border-b border-white/5">
              <div>
                <span className="text-paper-base">{record.foodName}</span>
                <span className="text-moon/60 text-sm ml-2">
                  {mealTypes.find(m => m.id === record.mealType)?.label}
                </span>
              </div>
              <span className="text-gold font-bold">{record.calories} kcal</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
