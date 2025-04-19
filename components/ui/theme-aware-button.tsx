"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface ThemeAwareButtonProps extends ButtonProps {
  children: React.ReactNode
  className?: string
  animateOnThemeChange?: boolean
  rippleEffect?: boolean
}

export function ThemeAwareButton({
  children,
  className,
  animateOnThemeChange = true,
  rippleEffect = true,
  ...props
}: ThemeAwareButtonProps) {
  const { theme } = useTheme()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (rippleEffect) {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()

      const ripple = document.createElement("span")
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.className = "absolute rounded-full bg-white/30 pointer-events-none"
      ripple.style.transform = "scale(0)"
      ripple.style.animation = "ripple 600ms linear"

      button.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 700)
    }

    props.onClick?.(e)
  }

  const variants = {
    light: {
      backgroundColor: props.variant === "outline" ? "transparent" : "var(--btn-bg, hsl(222.2, 47.4%, 11.2%))",
      color: props.variant === "outline" ? "var(--btn-fg, hsl(222.2, 47.4%, 11.2%))" : "var(--btn-fg, white)",
      borderColor: props.variant === "outline" ? "var(--border, hsl(214.3, 31.8%, 91.4%))" : "transparent",
    },
    dark: {
      backgroundColor: props.variant === "outline" ? "transparent" : "var(--btn-bg-dark, hsl(210, 40%, 98%))",
      color:
        props.variant === "outline"
          ? "var(--btn-fg-dark, hsl(210, 40%, 98%))"
          : "var(--btn-fg-dark, hsl(222.2, 47.4%, 11.2%))",
      borderColor: props.variant === "outline" ? "var(--border-dark, hsl(217.2, 32.6%, 17.5%))" : "transparent",
    },
  }

  return (
    <motion.div
      animate={animateOnThemeChange ? (theme === "dark" ? "dark" : "light") : undefined}
      variants={variants}
      transition={{ duration: 0.5 }}
      className={cn("relative overflow-hidden button-theme-transition", className)}
    >
      <Button
        className="bg-transparent border-transparent text-inherit hover:text-inherit hover:bg-black/10 dark:hover:bg-white/10"
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}
