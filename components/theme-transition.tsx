"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useThemeTransition } from "@/hooks/use-theme-transition"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface ThemeTransitionProps {
  children: React.ReactNode
}

export function ThemeTransition({ children }: ThemeTransitionProps) {
  const { theme, isTransitioning } = useThemeTransition()
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [contrastLevel] = useLocalStorage("dark-mode-contrast", 100)
  const [dimLevel] = useLocalStorage("dark-mode-dim", 100)
  const [reducedMotion] = useLocalStorage("reduced-motion", false)
  const [autoSwitch] = useLocalStorage("auto-dark-mode", false)

  // Track mouse position for ripple effect origin
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Apply dark mode settings
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--dark-contrast", `${contrastLevel}%`)
      document.documentElement.style.setProperty("--dark-dim", `${dimLevel}%`)

      if (reducedMotion) {
        document.documentElement.classList.add("reduce-motion")
      } else {
        document.documentElement.classList.remove("reduce-motion")
      }
    }
  }, [contrastLevel, dimLevel, reducedMotion])

  // Auto switch based on time of day
  useEffect(() => {
    if (!autoSwitch || typeof window === "undefined") return

    const checkTime = () => {
      const hour = new Date().getHours()
      const isDayTime = hour >= 7 && hour < 19 // 7 AM to 7 PM

      if (isDayTime && theme === "dark") {
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
      } else if (!isDayTime && theme === "light") {
        document.documentElement.classList.remove("light")
        document.documentElement.classList.add("dark")
      }
    }

    checkTime()
    const interval = setInterval(checkTime, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [autoSwitch, theme])

  return (
    <div className={`theme-transition ${reducedMotion ? "reduce-motion" : ""}`}>
      {isTransitioning && !reducedMotion && (
        <div
          className={`theme-switch-overlay active ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      )}
      {children}
    </div>
  )
}
