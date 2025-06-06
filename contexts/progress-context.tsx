"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useNotification } from "./notification-context"

// Define the shape of our progress context
type ProgressContextType = {
  progress: number
  setProgress: (value: number) => void
  incrementProgress: () => void
  resetProgress: () => void
  isComplete: boolean
}

// Create the context with default values
export const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

// Provider component
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0)
  const { showNotification } = useNotification()
  const isComplete = progress >= 100

  // Increment progress by 10%
  const incrementProgress = () => {
    setProgress((prev) => {
      const newProgress = Math.min(prev + 10, 100)
      return newProgress
    })
  }

  // Reset progress to 0
  const resetProgress = () => {
    setProgress(0)
  }

  // Show notification when progress is complete
  useEffect(() => {
    if (isComplete) {
      showNotification({
        title: "Progress Complete",
        message: "You've completed all the required steps!",
        type: "success",
      })
    }
  }, [isComplete, showNotification])

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setProgress,
        incrementProgress,
        resetProgress,
        isComplete,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

// Custom hook to use the progress context
export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
