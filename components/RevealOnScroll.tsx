'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealOnScrollProps = {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

export default function RevealOnScroll({
  children,
  delay = 0,
  className,
  y = 24,
}: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
