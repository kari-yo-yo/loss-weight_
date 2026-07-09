'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PillButton } from '@/components/ui/PillButton'

export function WeightForm() {
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [note, setNote] = useState('')
  const [records, setRecords] = useState<any[]>([])
  const [showStamp, setShowStamp] = useState(false)

  const fetchRecords = async () => {
    const res = await fetch('/api/weight')
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

    const res = await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weight: parseFloat(weight),
        bodyFat: bodyFat ? parseFloat(bodyFat) : null,
        note,
        date: new Date().toISOString(),
      }),
    })

    if (res.ok) {
      setShowStamp(true)
      setTimeout(() => setShowStamp(false), 2000)
      setWeight('')
      setBodyFat('')
      setNote('')
      fetchRecords()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">记录今日体重</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-moon/60 mb-2 font-serif">体重 (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
                placeholder="65.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-moon/60 mb-2 font-serif">体脂率 (%)</label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
                placeholder="20.5"
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
              placeholder="早起空腹称重"
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
                  className="absolute -top-4 right-10 w-24 h-24 border-4 border-cinnabar rounded-full flex items-center justify-center"
                >
                  <span className="font-calligraphy text-cinnabar text-2xl">已打卡</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">近期记录</h3>
        <div className="space-y-3">
          {records.map((record: any) => (
            <div key={record.id} className="flex justify-between items-center py-3 border-b border-white/5">
              <div>
                <span className="text-paper-base font-bold">{record.weight} kg</span>
                {record.bodyFat && <span className="text-moon/60 text-sm ml-2">体脂 {record.bodyFat}%</span>}
              </div>
              <span className="text-moon/40 text-sm">
                {new Date(record.date).toLocaleDateString('zh-CN')}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
