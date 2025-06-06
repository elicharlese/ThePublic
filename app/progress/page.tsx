"use client"

import { PageTransition } from "@/components/page-transition"
import { AnimatedSection } from "@/components/animated-section"
import { ProgressTracker } from "@/components/progress-tracker"
import { ProgressSettings } from "@/components/progress-settings"

export default function ProgressPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Your <span className="gradient-text">Progress</span>
          </h1>
          <p className="text-muted-foreground">Track and manage your progress on ThePublic network</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={0.1}>
            <ProgressTracker />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <ProgressSettings />
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  )
}
