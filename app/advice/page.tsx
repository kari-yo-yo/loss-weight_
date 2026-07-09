'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface AdviceItem {
  type: 'warning' | 'success' | 'info'
  title: string
  content: string
}

const WELLNESS_TIPS = [
  {
    icon: '气',
    title: '太极养生',
    content: '每日晨间太极十五分，调和气血，疏通经络。动作柔缓，呼吸深长，以意导气，气贯全身。',
    color: 'text-pine',
    bgColor: 'bg-pine/10',
    borderColor: 'border-pine/20',
  },
  {
    icon: '食',
    title: '饮食有节',
    content: '早餐如皇帝，午餐如大臣，晚餐如乞丐。七分饱为宜，细嚼慢咽，养护脾胃。',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/20',
  },
  {
    icon: '眠',
    title: '早睡早起',
    content: '子时前入睡，卯时前起床。顺应天时，借天地之气以养人之元气。',
    color: 'text-indigo',
    bgColor: 'bg-indigo/10',
    borderColor: 'border-indigo/20',
  },
  {
    icon: '心',
    title: '静心养性',
    content: '每日静坐十数分钟，观照呼吸，放下杂念。心静则神安，神安则气顺。',
    color: 'text-cinnabar',
    bgColor: 'bg-cinnabar/10',
    borderColor: 'border-cinnabar/20',
  },
]

const TYPE_CONFIG = {
  warning: {
    icon: '警',
    color: 'text-ochre',
    bgColor: 'bg-ochre/10',
    borderColor: 'border-ochre/20',
    barColor: 'bg-ochre',
  },
  success: {
    icon: '吉',
    color: 'text-pine',
    bgColor: 'bg-pine/10',
    borderColor: 'border-pine/20',
    barColor: 'bg-pine',
  },
  info: {
    icon: '知',
    color: 'text-indigo',
    bgColor: 'bg-indigo/10',
    borderColor: 'border-indigo/20',
    barColor: 'bg-indigo',
  },
}

export default function AdvicePage() {
  const [advice, setAdvice] = useState<AdviceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/advice')
      .then((res) => res.json())
      .then((data) => {
        setAdvice(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
          <span className="font-calligraphy text-3xl text-gold/60">梅</span>
          <h1 className="text-2xl md:text-3xl font-serif text-foreground">
            养生建议
          </h1>
        </div>
        <p className="text-foreground/40 text-sm font-serif ml-12">
          因时制宜，顺势而为，养生之道在于日常
        </p>
      </motion.div>

      {/* 个性化建议区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-cinnabar/10 border border-cinnabar/20 flex items-center justify-center">
            <span className="font-calligraphy text-cinnabar text-sm">诊</span>
          </div>
          <h2 className="text-lg font-serif text-foreground">基于您近七日数据的建议</h2>
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gold/50 font-serif"
            >
              分析数据中...
            </motion.div>
          </div>
        ) : advice.length === 0 ? (
          <Card>
            <div className="text-center py-10">
              <span className="font-calligraphy text-4xl text-foreground/10 block mb-3">记</span>
              <p className="text-foreground/40 font-serif text-sm">
                暂无足够数据生成建议，请先记录体重、运动和饮食
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {advice.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AdviceCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* 养生小贴士 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <span className="font-calligraphy text-gold text-sm">经</span>
          </div>
          <h2 className="text-lg font-serif text-foreground">养生经要</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WELLNESS_TIPS.map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card delay={index * 0.05}>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${tip.bgColor} ${tip.borderColor} border flex items-center justify-center flex-shrink-0`}
                  >
                    <span className={`font-calligraphy ${tip.color} text-lg`}>
                      {tip.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-serif font-medium ${tip.color} mb-1`}>
                      {tip.title}
                    </h3>
                    <p className="text-foreground/50 text-sm leading-relaxed">
                      {tip.content}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function AdviceCard({ item }: { item: AdviceItem }) {
  const config = TYPE_CONFIG[item.type]

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl ${config.bgColor} ${config.borderColor} border flex items-center justify-center flex-shrink-0`}
        >
          <span className={`font-calligraphy ${config.color} text-lg`}>
            {config.icon}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`font-serif font-medium ${config.color}`}>
              {item.title}
            </h3>
            <div className={`w-8 h-0.5 ${config.barColor} rounded-full opacity-40`} />
          </div>
          <p className="text-foreground/60 text-sm leading-relaxed">
            {item.content}
          </p>
        </div>
      </div>
    </Card>
  )
}
