'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PillButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export function PillButton({ children, onClick, variant = 'primary', className = '' }: PillButtonProps) {
  const variants = {
    primary: 'bg-cinnabar text-paper-base hover:shadow-lg hover:shadow-cinnabar/30',
    secondary: 'bg-indigo text-paper-base hover:shadow-lg hover:shadow-indigo/30',
    ghost: 'bg-transparent border border-gold/30 text-gold hover:bg-gold/10',
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
