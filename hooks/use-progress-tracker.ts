"use client"

import { useEffect } from "react"
import { useProgress } from "@/contexts/progress-context"
import { useWallet } from "@/hooks/use-wallet"

export function useProgressTracker() {
  const { progress, incrementProgress, resetProgress, isComplete } = useProgress()
  const { connected } = useWallet() || { connected: false }

  // Reset progress when wallet connection changes
  useEffect(() => {
    if (!connected) {
      resetProgress()
    }
  }, [connected, resetProgress])

  return {
    progress,
    incrementProgress,
    resetProgress,
    isComplete,
  }
}
