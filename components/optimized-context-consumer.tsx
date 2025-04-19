"use client"

import { memo, type ReactNode, type ComponentType } from "react"

// This is a higher-order component (HOC) that wraps components with React.memo
// to prevent unnecessary re-renders when props haven't changed
export function withMemoization<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
) {
  return memo(Component, propsAreEqual)
}

// Example usage:
// const MemoizedComponent = withMemoization(MyComponent);
// export default MemoizedComponent;

interface OptimizedContextConsumerProps {
  children: ReactNode
}

// This component can wrap sections of your app that should only re-render
// when specific context values change
export const OptimizedContextConsumer = memo(({ children }: OptimizedContextConsumerProps) => {
  return <>{children}</>
})
