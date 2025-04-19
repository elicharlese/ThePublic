"use client"

import { useProgress } from "@/contexts/progress-context"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Save, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ProgressWidget() {
  const { progress, saveProgress } = useProgress()

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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>{Math.round(overallProgress)}% Complete</span>
            <span className="text-xs text-muted-foreground">
              {progress.walletConnected ? "Wallet connected" : "Connect wallet to progress"}
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => saveProgress()}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <Link href="/progress">
            <Button variant="ghost" size="sm">
              Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
