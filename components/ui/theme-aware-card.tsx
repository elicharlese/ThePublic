"use client"

import React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface ThemeAwareCardProps extends CardProps {
  children: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  animateOnThemeChange?: boolean
}

export function ThemeAwareCard({
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  animateOnThemeChange = true,
  ...props
}: ThemeAwareCardProps) {
  const { theme } = useTheme()

  // Find child components
  const childArray = React.Children.toArray(children)
  const headerChild = childArray.find((child) => React.isValidElement(child) && child.type === CardHeader)
  const contentChild = childArray.find((child) => React.isValidElement(child) && child.type === CardContent)
  const footerChild = childArray.find((child) => React.isValidElement(child) && child.type === CardFooter)

  // Other children that aren't header, content, or footer
  const otherChildren = childArray.filter(
    (child) =>
      !React.isValidElement(child) ||
      (child.type !== CardHeader && child.type !== CardContent && child.type !== CardFooter),
  )

  const variants = {
    light: {
      backgroundColor: "var(--card-bg, white)",
      color: "var(--card-fg, black)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    dark: {
      backgroundColor: "var(--card-bg-dark, hsl(222.2, 84%, 4.9%))",
      color: "var(--card-fg-dark, white)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.18)",
    },
  }

  return (
    <motion.div
      animate={animateOnThemeChange ? (theme === "dark" ? "dark" : "light") : undefined}
      variants={variants}
      transition={{ duration: 0.5 }}
      className={cn("card-theme-transition", className)}
    >
      <Card className="border-0 bg-transparent shadow-none" {...props}>
        {headerChild && (
          <CardHeader className={cn("transition-colors duration-500", headerClassName)}>
            {headerChild.props.children}
          </CardHeader>
        )}

        {contentChild && (
          <CardContent className={cn("transition-colors duration-500", contentClassName)}>
            {contentChild.props.children}
          </CardContent>
        )}

        {footerChild && (
          <CardFooter className={cn("transition-colors duration-500", footerClassName)}>
            {footerChild.props.children}
          </CardFooter>
        )}

        {otherChildren}
      </Card>
    </motion.div>
  )
}
