import type { Metadata } from "next"
import Link from "next/link"
import { NetworkMap } from "@/components/network/network-map"
import { NetworkStatsPanel } from "@/components/network/network-stats-panel"
import { NetworkActivity } from "@/components/network/network-activity"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, Globe, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "Network Overview | ThePublic",
  description: "Explore ThePublic WiFi network statistics and activity",
}

export default function NetworkPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Network Overview</h1>
        <p className="text-xl text-muted-foreground mb-8">Explore ThePublic WiFi network statistics and activity</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border shadow-sm p-6 h-[400px] relative overflow-hidden">
              <NetworkMap />
            </div>
          </div>
          <div>
            <NetworkStatsPanel />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Network Activity</h2>
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <NetworkActivity />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/network/3d" className="block">
            <div className="bg-card rounded-lg border shadow-sm p-6 h-full hover:border-purple-500 transition-colors">
              <Globe className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Visualization</h3>
              <p className="text-muted-foreground mb-4">Explore the network in an interactive 3D visualization</p>
              <Button variant="outline" size="sm" className="gap-2">
                View <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Link>

          <Link href="/nodes" className="block">
            <div className="bg-card rounded-lg border shadow-sm p-6 h-full hover:border-purple-500 transition-colors">
              <Wifi className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Node Explorer</h3>
              <p className="text-muted-foreground mb-4">Browse and search all active nodes in the network</p>
              <Button variant="outline" size="sm" className="gap-2">
                Explore <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Link>

          <Link href="/host" className="block">
            <div className="bg-card rounded-lg border shadow-sm p-6 h-full hover:border-purple-500 transition-colors">
              <BarChart2 className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Host a Node</h3>
              <p className="text-muted-foreground mb-4">Learn how to host your own node and earn rewards</p>
              <Button variant="outline" size="sm" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
