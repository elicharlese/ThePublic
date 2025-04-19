"use client"

import { AnimatedButton } from "@/components/ui/animated-button"
import { useWallet } from "@/hooks/use-wallet"
import { useProgress } from "@/contexts/progress-context"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const { connected, publicKey } = useWallet()
  const { progress, saveProgress } = useProgress()

  // Use the progress tracker to update progress based on activity
  useProgressTracker()

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Dashboard
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Monitor your connection to ThePublic network
          </motion.p>
        </div>

        <div className="flex items-center gap-2">
          {connected && publicKey && (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-accent rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-sm font-medium">Connected:</span>
              <span className="text-sm font-mono">
                {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
              </span>
            </motion.div>
          )}

          <Link href="/progress">
            <AnimatedButton variant="outline" size="sm" className="rounded-full">
              <Save className="h-4 w-4 mr-2" />
              View Progress
            </AnimatedButton>
          </Link>
        </div>
      </div>

      <motion.div
        className="mt-6 flex gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatedButton variant="secondary" size="sm" className="rounded-full">
          Overview
        </AnimatedButton>
        <AnimatedButton variant="ghost" size="sm" className="rounded-full">
          Activity
        </AnimatedButton>
        <AnimatedButton variant="ghost" size="sm" className="rounded-full">
          Rewards
        </AnimatedButton>
        <AnimatedButton variant="ghost" size="sm" className="rounded-full">
          Settings
        </AnimatedButton>
      </motion.div>
    </motion.div>
  )
}
