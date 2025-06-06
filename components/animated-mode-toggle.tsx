"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sun, MoonStar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeTransition } from "@/hooks/use-theme-transition"

export function AnimatedModeToggle() {
  const { theme, toggleTheme } = useThemeTransition()
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-full opacity-0" aria-hidden="true">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 overflow-hidden rounded-full"
      aria-label="Toggle theme"
    >
      <div className="relative h-full w-full">
        {/* Sun */}
        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 0 : 1,
            opacity: theme === "dark" ? 0 : 1,
            rotate: theme === "dark" ? -30 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
        </motion.div>

        {/* Moon with stars */}
        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            opacity: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : 30,
          }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <MoonStar className="h-[1.2rem] w-[1.2rem] text-purple-300" />
        </motion.div>

        {/* Background glow effect */}
        <motion.div
          initial={false}
          animate={{
            opacity: theme === "dark" ? 0.15 : 0,
          }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 rounded-full bg-purple-400 blur-md"
        />
      </div>
    </Button>
  )
}
