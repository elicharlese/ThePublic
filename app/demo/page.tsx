"use client"

import { useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedInput } from "@/components/ui/animated-input"
import { AnimatedIcon } from "@/components/ui/animated-icon"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useNotification } from "@/contexts/notification-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, Bell, Check, AlertTriangle, Info } from "lucide-react"

export default function DemoPage() {
  const { showNotification } = useNotification()
  const [activeTab, setActiveTab] = useState("Animations")
  const tabs = ["Animations", "Components", "Interactions"]

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Animation <span className="gradient-text">Showcase</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore the subtle animations and interactions throughout ThePublic app
          </p>
        </div>

        <div className="mb-8">
          <AnimatedTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="max-w-md mx-auto" />
        </div>

        <div className="grid gap-8">
          <AnimatedSection delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Button Animations</CardTitle>
                <CardDescription>Hover, tap, and focus animations for buttons</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <AnimatedButton>Primary Button</AnimatedButton>
                <AnimatedButton variant="secondary">Secondary Button</AnimatedButton>
                <AnimatedButton variant="outline">Outline Button</AnimatedButton>
                <AnimatedButton variant="ghost">Ghost Button</AnimatedButton>
                <AnimatedButton variant="destructive">Destructive Button</AnimatedButton>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Card Animations</CardTitle>
                <CardDescription>Hover and entrance animations for cards</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <AnimatedCard className="p-4">
                  <h3 className="font-medium mb-2">Hover Effect</h3>
                  <p className="text-sm text-muted-foreground">Hover over this card to see the animation</p>
                </AnimatedCard>
                <AnimatedCard className="p-4" hoverEffect={false}>
                  <h3 className="font-medium mb-2">No Hover Effect</h3>
                  <p className="text-sm text-muted-foreground">This card has no hover animation</p>
                </AnimatedCard>
                <AnimatedCard className="p-4 bg-primary/5">
                  <h3 className="font-medium mb-2">Custom Background</h3>
                  <p className="text-sm text-muted-foreground">Card with custom background color</p>
                </AnimatedCard>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Form Input Animations</CardTitle>
                <CardDescription>Focus and interaction animations for form inputs</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Animated Input</label>
                  <AnimatedInput placeholder="Type something..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Animated Input with Value</label>
                  <AnimatedInput defaultValue="ThePublic WiFi" />
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Icon Animations</CardTitle>
                <CardDescription>Various animation effects for icons</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
                <div className="text-center">
                  <AnimatedIcon icon={<Wifi className="h-8 w-8 text-primary" />} effect="pulse" />
                  <p className="text-sm mt-2">Pulse</p>
                </div>
                <div className="text-center">
                  <AnimatedIcon icon={<Wifi className="h-8 w-8 text-primary" />} effect="bounce" />
                  <p className="text-sm mt-2">Bounce</p>
                </div>
                <div className="text-center">
                  <AnimatedIcon icon={<Wifi className="h-8 w-8 text-primary" />} effect="spin" />
                  <p className="text-sm mt-2">Spin</p>
                </div>
                <div className="text-center">
                  <AnimatedIcon icon={<Wifi className="h-8 w-8 text-primary" />} effect="shake" />
                  <p className="text-sm mt-2">Shake</p>
                </div>
                <div className="text-center">
                  <AnimatedIcon icon={<Wifi className="h-8 w-8 text-primary" />} effect="none" />
                  <p className="text-sm mt-2">Hover Only</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <Card>
              <CardHeader>
                <CardTitle>Counters & Loaders</CardTitle>
                <CardDescription>Animated counters and loading indicators</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium">Animated Counters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-3xl font-bold">
                        <AnimatedCounter from={0} to={1248} duration={2} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Active Nodes</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-3xl font-bold">
                        <AnimatedCounter from={0} to={85} duration={2} formatter={(v) => `${v.toFixed(0)}%`} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Network Uptime</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Loading Spinners</h3>
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <LoadingSpinner size="sm" />
                      <p className="text-sm mt-2">Small</p>
                    </div>
                    <div className="text-center">
                      <LoadingSpinner size="md" />
                      <p className="text-sm mt-2">Medium</p>
                    </div>
                    <div className="text-center">
                      <LoadingSpinner size="lg" />
                      <p className="text-sm mt-2">Large</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Toast notifications with animations</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <AnimatedButton onClick={() => showNotification("Information", "This is an informational message")}>
                  <Info className="h-4 w-4 mr-2" /> Show Default Notification
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => showNotification("Success", "Operation completed successfully", "success")}
                  variant="outline"
                >
                  <Check className="h-4 w-4 mr-2" /> Show Success Notification
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => showNotification("Warning", "Please review your settings", "warning")}
                  variant="outline"
                >
                  <Bell className="h-4 w-4 mr-2" /> Show Warning Notification
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => showNotification("Error", "Something went wrong", "error")}
                  variant="outline"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" /> Show Error Notification
                </AnimatedButton>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  )
}
