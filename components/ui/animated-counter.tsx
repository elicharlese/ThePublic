"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  delay?: number
  formatter?: (value: number) => string
  className?: string
}

export function AnimatedCounter({
  from,
  to,
  duration = 2,
  delay = 0,
  formatter = (value) => Math.round(value).toString(),
  className,
}: AnimatedCounterProps) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => formatter(latest))
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (inView && !hasAnimated) {
      const animation = animate(count, to, { duration, delay })
      setHasAnimated(true)
      return animation.stop
    }
  }, [count, inView, to, duration, delay, hasAnimated])

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
    </span>
  )
}
