"use client"

import { useState } from "react"
import { useProgress } from "@/contexts/progress-context"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { AnimatedIcon } from "@/components/ui/animated-icon"
import { motion } from "framer-motion"
import { Save, RotateCcw, Clock, Download, Upload, Coins, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ProgressTracker() {
  const { progress, saveProgress, resetProgress, lastSaved } = useProgress()
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  // Calculate overall progress percentage
  const calculateOverallProgress = () => {
    let total = 0
    let completed = 0

    // Wallet connection
    total += 1
    if (progress.walletConnected) completed += 1

    // Node setup (if applicable)
    if (progress.isNodeHost) {
      total += 1
      if (progress.nodeSetupCompleted) completed += 1
    }

    // Return percentage
    return (completed / total) * 100
  }

  const overallProgress = calculateOverallProgress()

  return (
    <AnimatedCard>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Track your journey on ThePublic network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div className="p-4 border rounded-lg" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-2">
              <AnimatedIcon icon={<Clock className="h-4 w-4 text-primary" />} effect="none" />
              <span className="text-sm font-medium">Connected Time</span>
            </div>
            <div className="text-2xl font-bold">
              <AnimatedCounter
                from={0}
                to={progress.connectedTime}
                formatter={(v) => `${Math.floor(v / 60)}h ${Math.round(v % 60)}m`}
              />
            </div>
          </motion.div>

          <motion.div className="p-4 border rounded-lg" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-2">
              <AnimatedIcon icon={<Coins className="h-4 w-4 text-primary" />} effect="pulse" />
              <span className="text-sm font-medium">Tokens Earned</span>
            </div>
            <div className="text-2xl font-bold">
              <AnimatedCounter from={0} to={progress.tokensEarned} formatter={(v) => `${v.toFixed(1)} PUB`} />
            </div>
          </motion.div>

          <motion.div className="p-4 border rounded-lg" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-2">
              <AnimatedIcon icon={<Download className="h-4 w-4 text-primary" />} effect="none" />
              <span className="text-sm font-medium">Downloaded</span>
            </div>
            <div className="text-2xl font-bold">
              <AnimatedCounter from={0} to={progress.dataDownloaded / 1024} formatter={(v) => `${v.toFixed(1)} GB`} />
            </div>
          </motion.div>

          <motion.div className="p-4 border rounded-lg" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-2 mb-2">
              <AnimatedIcon icon={<Upload className="h-4 w-4 text-primary" />} effect="none" />
              <span className="text-sm font-medium">Uploaded</span>
            </div>
            <div className="text-2xl font-bold">
              <AnimatedCounter from={0} to={progress.dataUploaded / 1024} formatter={(v) => `${v.toFixed(1)} GB`} />
            </div>
          </motion.div>
        </div>

        {/* Completion checklist */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Completion Checklist</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {progress.walletConnected ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                )}
                <span className="text-sm">Connect Wallet</span>
              </div>
              {progress.walletConnected && <span className="text-xs text-muted-foreground">Completed</span>}
            </div>

            {progress.isNodeHost && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {progress.nodeSetupCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                  )}
                  <span className="text-sm">Set Up Node</span>
                </div>
                {progress.nodeSetupCompleted && <span className="text-xs text-muted-foreground">Completed</span>}
              </div>
            )}
          </div>
        </div>

        {/* Last saved info */}
        {lastSaved && (
          <div className="text-xs text-muted-foreground text-center">
            Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => saveProgress()}>
          <Save className="h-4 w-4 mr-2" />
          Save Progress
        </Button>

        {!showConfirmReset ? (
          <Button variant="ghost" size="sm" onClick={() => setShowConfirmReset(true)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              resetProgress()
              setShowConfirmReset(false)
            }}
          >
            Confirm Reset
          </Button>
        )}
      </CardFooter>
    </AnimatedCard>
  )
}
