"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/page-transition"
import { AnimatedSection } from "@/components/animated-section"
import { NetworkVisualizationFallback } from "@/components/network/network-visualization-fallback"
import { NetworkStatsPanel } from "@/components/network/network-stats-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Create a dynamic import for the 3D visualization with no SSR
const DynamicNetwork3DVisualization = dynamic(
  () =>
    import("@/components/network/network-3d-visualization").then((mod) => ({ default: mod.Network3DVisualization })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center" style={{ height: 700 }}>
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <span className="mt-2 text-sm">Loading 3D visualization...</span>
        </div>
      </div>
    ),
  },
)

export default function Network3DPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [visualizationError, setVisualizationError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Handle errors in the 3D visualization
  const handleVisualizationError = () => {
    console.error("Failed to load 3D visualization")
    setVisualizationError(true)
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              3D Network <span className="gradient-text">Visualization</span>
            </h1>
            <p className="text-muted-foreground">Explore ThePublic's global network in 3D space</p>
          </div>
          <div className="flex gap-2">
            <Link href="/network">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Network
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-2" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </div>

        <AnimatedSection delay={0.1}>
          <NetworkStatsPanel />
        </AnimatedSection>

        <div className="mt-8">
          <Tabs defaultValue="3d">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="3d">3D View</TabsTrigger>
                <TabsTrigger value="help">Help & Controls</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="3d">
              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                  {!isClient ? (
                    <div className="flex items-center justify-center" style={{ height: 700 }}>
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                        <span className="mt-2 text-sm">Loading...</span>
                      </div>
                    </div>
                  ) : visualizationError ? (
                    <NetworkVisualizationFallback height={700} />
                  ) : (
                    <div onError={handleVisualizationError}>
                      <DynamicNetwork3DVisualization height={700} />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </TabsContent>

            <TabsContent value="help">
              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-4">3D Network Controls</h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Navigation</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-mono">Left Click + Drag</span>
                          </div>
                          <span>Rotate the network</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-mono">Right Click + Drag</span>
                          </div>
                          <span>Pan the view</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-mono">Scroll</span>
                          </div>
                          <span>Zoom in/out</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-mono">Double Click</span>
                          </div>
                          <span>Reset view</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Interaction</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-mono">Click on Node</span>
                          </div>
                          <span>Select a node to view details</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-mono">Hover on Node</span>
                          </div>
                          <span>Highlight node and its connections</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded">
                            <span className="text-xs font-mono">Info Button</span>
                          </div>
                          <span>Reset selection</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">About the Visualization</h3>
                    <p className="text-muted-foreground">
                      This 3D visualization represents ThePublic's global network of nodes and their connections. Nodes
                      are positioned in a spherical layout, with validators closer to the center and standard nodes on
                      the outer edges. The size and color of each node indicates its type and status, while the
                      thickness of connections represents the amount of traffic between nodes.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Active nodes pulse gently and have animated data packets traveling along their connections. Select
                      a node to view detailed information and highlight all of its connections.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  )
}
