"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, hoverEffect = true, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
      >
        <Card ref={ref} className={cn("relative overflow-hidden transition-all duration-300", className)} {...props}>
          {children}
          {hoverEffect && (
            <motion.div
              className="absolute inset-0 bg-primary/5 opacity-0 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </Card>
      </motion.div>
    )
  },
)
AnimatedCard.displayName = "AnimatedCard"
