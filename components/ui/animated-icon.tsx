"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedIconProps {
  icon: ReactNode
  className?: string
  effect?: "pulse" | "bounce" | "spin" | "shake" | "none"
}

export function AnimatedIcon({ icon, className, effect = "none" }: AnimatedIconProps) {
  const getEffectAnimation = () => {
    switch (effect) {
      case "pulse":
        return {
          animate: {
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1],
          },
          transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "bounce":
        return {
          animate: {
            y: [0, -5, 0],
          },
          transition: {
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "spin":
        return {
          animate: {
            rotate: 360,
          },
          transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
        }
      case "shake":
        return {
          animate: {
            x: [0, -2, 2, -2, 0],
          },
          transition: {
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          },
        }
      default:
        return {}
    }
  }

  const { animate, transition } = getEffectAnimation()

  return (
    <motion.div
      className={cn("inline-flex", className)}
      animate={animate}
      transition={transition}
      whileHover={{ scale: 1.1 }}
    >
      {icon}
    </motion.div>
  )
}
