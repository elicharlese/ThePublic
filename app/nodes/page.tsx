import type { Metadata } from "next"
import { NodeList } from "@/components/network/node-list"
import { NetworkStatsPanel } from "@/components/network/network-stats-panel"

export const metadata: Metadata = {
  title: "Network Nodes | ThePublic",
  description: "Explore all active nodes in ThePublic WiFi network",
}

export default function NodesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Network Nodes</h1>
        <p className="text-xl text-muted-foreground mb-8">Explore all active nodes in ThePublic WiFi network</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NodeList />
          </div>
          <div>
            <NetworkStatsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
