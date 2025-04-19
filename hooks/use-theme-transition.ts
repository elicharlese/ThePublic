"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function useThemeTransition() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousTheme, setPreviousTheme] = useState<string | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track theme changes to trigger animations
  useEffect(() => {
    if (!mounted) return

    if (previousTheme && previousTheme !== theme) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 750) // Match this with the CSS transition duration
      return () => clearTimeout(timer)
    }
    setPreviousTheme(theme)
  }, [theme, previousTheme, mounted])

  const toggleTheme = () => {
    if (!mounted) return
    const currentTheme = resolvedTheme || theme
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  return {
    theme: mounted ? resolvedTheme : undefined,
    setTheme,
    isTransitioning,
    toggleTheme,
    previousTheme,
    mounted,
  }
}
