"use client"

import { useCallback, useContext, useMemo } from "react"
import { ProgressContext } from "@/contexts/progress-context"

// This hook allows components to subscribe to only specific parts of the progress state
// to prevent unnecessary re-renders when unrelated state changes
export function useSelectiveProgress<T>(selector: (progress: any) => T) {
  const context = useContext(ProgressContext)

  if (context === undefined) {
    throw new Error("useSelectiveProgress must be used within a ProgressProvider")
  }

  // Only extract the specific data needed by the component
  const selectedData = useMemo(() => selector(context.progress), [selector, context.progress])

  // Provide only the update function
  const updateSelectedProgress = useCallback(
    (updates: Partial<any>) => {
      context.updateProgress(updates)
    },
    [context.updateProgress],
  )

  return {
    selectedData,
    updateSelectedProgress,
    saveProgress: context.saveProgress,
  }
}

// Example usage:
// const { selectedData: onboardingData } = useSelectiveProgress(
//   progress => ({
//     onboardingStep: progress.onboardingStep,
//     onboardingCompleted: progress.onboardingCompleted
//   })
// );
