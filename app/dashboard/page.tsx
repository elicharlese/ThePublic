"use client"

import { NetworkStatus } from "@/components/dashboard/network-status"
import { UserStats } from "@/components/dashboard/user-stats"
import { ConnectedDevices } from "@/components/dashboard/connected-devices"
import { NearbyNodes } from "@/components/dashboard/nearby-nodes"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PageTransition } from "@/components/page-transition"
import { AnimatedSection } from "@/components/animated-section"
import { ProgressWidget } from "@/components/progress-widget"
import { useProgressTracker } from "@/hooks/use-progress-tracker"
import { RecentConnections } from "@/components/dashboard/recent-connections"

export default function DashboardPage() {
  // Use the progress tracker to update progress based on activity
  useProgressTracker()

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AnimatedSection delay={0.1}>
            <NetworkStatus />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <UserStats />
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedSection delay={0.3} className="md:col-span-2">
            <ConnectedDevices />
          </AnimatedSection>
          <AnimatedSection delay={0.4} className="space-y-6">
            <ProgressWidget />
            <RecentConnections />
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatedSection delay={0.5}>
            <NearbyNodes />
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  )
}
