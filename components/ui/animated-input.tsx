"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(({ className, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <div className="relative">
      <Input
        ref={ref}
        className={cn("transition-all duration-300", className)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: isFocused ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
})
AnimatedInput.displayName = "AnimatedInput"
