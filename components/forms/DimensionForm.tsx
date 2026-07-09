'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PillButton } from '@/components/ui/PillButton'

export function DimensionForm() {
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [chest, setChest] = useState('')
  const [arm, setArm] = useState('')
  const [thigh, setThigh] = useState('')
  const [records, setRecords] = useState<any[]>([])
  const [showStamp, setShowStamp] = useState(false)

  const fetchRecords = async () => {
    const res = await fetch('/api/dimension')
    if (res.ok) {
      const data = await res.json()
      setRecords(data.slice(0, 5))
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/dimension', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        waist: waist ? parseFloat(waist) : null,
        hip: hip ? parseFloat(hip) : null,
        chest: chest ? parseFloat(chest) : null,
        arm: arm ? parseFloat(arm) : null,
        thigh: thigh ? parseFloat(thigh) : null,
        date: new Date().toISOString(),
      }),
    })

    if (res.ok) {
      setShowStamp(true)
      setTimeout(() => setShowStamp(false), 2000)
      setWaist('')
      setHip('')
      setChest('')
      setArm('')
      setThigh('')
      fetchRecords()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">记录身体维度</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '腰围 (cm)', value: waist, set: setWaist },
              { label: '臀围 (cm)', value: hip, set: setHip },
              { label: '胸围 (cm)', value: chest, set: setChest },
              { label: '臂围 (cm)', value: arm, set: setArm },
              { label: '大腿围 (cm)', value: thigh, set: setThigh },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-sm text-moon/60 mb-2 font-serif">{field.label}</label>
                <input
                  type="number"
                  step="0.1"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-paper-base focus:border-gold/50 focus:outline-none"
                  placeholder="--"
                />
              </div>
            ))}
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
                  className="absolute -top-4 right-10 w-24 h-24 border-4 border-gold rounded-full flex items-center justify-center"
                >
                  <span className="font-calligraphy text-gold text-2xl">已记录</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="font-serif text-lg text-paper-base mb-4">近期测量</h3>
        <div className="space-y-3">
          {records.map((record: any) => (
            <div key={record.id} className="py-3 border-b border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-moon/40 text-sm">
                  {new Date(record.date).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex gap-4 flex-wrap text-sm">
                {record.waist && <span className="text-moon/60">腰 <span className="text-paper-base">{record.waist}</span></span>}
                {record.hip && <span className="text-moon/60">臀 <span className="text-paper-base">{record.hip}</span></span>}
                {record.chest && <span className="text-moon/60">胸 <span className="text-paper-base">{record.chest}</span></span>}
                {record.arm && <span className="text-moon/60">臂 <span className="text-paper-base">{record.arm}</span></span>}
                {record.thigh && <span className="text-moon/60">腿 <span className="text-paper-base">{record.thigh}</span></span>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
