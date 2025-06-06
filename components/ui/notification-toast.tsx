"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { notificationToast } from "@/lib/animation-variants"

interface NotificationToastProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
  className?: string
}

export function NotificationToast({
  title,
  description,
  isOpen,
  onClose,
  variant = "default",
  duration = 5000,
  className,
}: NotificationToastProps) {
  React.useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  const variantStyles = {
    default: "bg-background border-border",
    success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30",
    error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30",
    warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/30",
  }

  const iconVariants = {
    default: <div className="w-2 h-2 rounded-full bg-primary" />,
    success: <div className="w-2 h-2 rounded-full bg-green-500" />,
    error: <div className="w-2 h-2 rounded-full bg-red-500" />,
    warning: <div className="w-2 h-2 rounded-full bg-yellow-500" />,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg",
            variantStyles[variant],
            className,
          )}
          variants={notificationToast}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">{iconVariants[variant]}</div>
            <div className="flex-1">
              <h3 className="font-medium">{title}</h3>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
