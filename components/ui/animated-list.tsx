"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"
import { staggerContainer, listItem } from "@/lib/animation-variants"

interface AnimatedListProps {
  items: Array<{ id: string; content: ReactNode }>
  staggerDelay?: number
}

export function AnimatedList({ items, staggerDelay = 0.05 }: AnimatedListProps) {
  return (
    <motion.ul variants={staggerContainer(staggerDelay)} initial="hidden" animate="visible" className="space-y-2">
      <AnimatePresence>
        {items.map((item) => (
          <motion.li key={item.id} variants={listItem} layout>
            {item.content}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
