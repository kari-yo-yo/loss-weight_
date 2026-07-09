'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WeightForm } from '@/components/forms/WeightForm'
import { DietForm } from '@/components/forms/DietForm'
import { ExerciseForm } from '@/components/forms/ExerciseForm'
import { DimensionForm } from '@/components/forms/DimensionForm'

const tabs = [
  { id: 'weight', label: '体重', icon: '⚖' },
  { id: 'diet', label: '饮食', icon: '🍵' },
  { id: 'exercise', label: '运动', icon: '☯' },
  { id: 'dimension', label: '维度', icon: '📐' },
]

export default function RecordPage() {
  const [activeTab, setActiveTab] = useState('weight')

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl text-paper-base mb-2">记录中心</h1>
        <p className="text-moon/60 font-serif">记录每一刻，见证每一步变化</p>
      </motion.div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-serif text-sm whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-cinnabar text-paper-base shadow-lg shadow-cinnabar/20'
                : 'bg-white/5 text-moon/60 hover:text-paper-base hover:bg-white/10'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<div className="text-moon/40 text-center py-10">加载中...</div>}>
            {activeTab === 'weight' && <WeightForm />}
            {activeTab === 'diet' && <DietForm />}
            {activeTab === 'exercise' && <ExerciseForm />}
            {activeTab === 'dimension' && <DimensionForm />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
