"use client"

import { useRef, useEffect, useMemo } from "react"

// This utility helps detect unnecessary re-renders
export function useRenderCounter(componentName: string, logRenders = false) {
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1

    if (logRenders) {
      console.log(`${componentName} rendered ${renderCount.current} times`)
    }
  })

  return renderCount.current
}

// This utility helps with deep comparison for memoization
export function useDeepCompareMemo<T>(value: T, deps: any[]) {
  const ref = useRef<T>()

  const areEqual = (prev: any[], next: any[]) => {
    if (prev.length !== next.length) return false

    for (let i = 0; i < prev.length; i++) {
      if (JSON.stringify(prev[i]) !== JSON.stringify(next[i])) {
        return false
      }
    }

    return true
  }

  if (!ref.current || !areEqual(deps, ref.current as any)) {
    ref.current = value as any
  }

  return ref.current
}

// Split context into smaller pieces to prevent unnecessary re-renders
export function createSelectorHook<T, R>(useContextHook: () => T, selector: (state: T) => R) {
  return function useSelector(): R {
    const state = useContextHook()
    return useMemo(() => selector(state), [state])
  }
}
