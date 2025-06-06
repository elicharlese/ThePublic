"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedTabsProps {
  tabs: string[]
  activeTab: string
  onChange: (tab: string) => void
  className?: string
}

export function AnimatedTabs({ tabs, activeTab, onChange, className }: AnimatedTabsProps) {
  return (
    <div className={cn("flex space-x-1 rounded-lg bg-muted p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary",
            activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
          style={{ position: "relative" }}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-background rounded-md"
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  )
}
