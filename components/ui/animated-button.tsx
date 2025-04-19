"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { buttonTap } from "@/lib/animation-variants"
import type { ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  className?: string
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div whileTap="tap" variants={buttonTap} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Button ref={ref} className={cn("relative overflow-hidden group", className)} {...props}>
          <span className="relative z-10">{children}</span>
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </motion.div>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"
