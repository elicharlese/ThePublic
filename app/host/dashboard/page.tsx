import { NodeStatus } from "@/components/host/node-status"
import { PerformanceMetrics } from "@/components/host/performance-metrics"
import { RewardHistory } from "@/components/host/reward-history"
import { ConnectedUsers } from "@/components/host/connected-users"
import { MaintenanceTools } from "@/components/host/maintenance-tools"

export default function HostDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Node Dashboard</h1>
      <p className="text-muted-foreground mb-8">Monitor and manage your ThePublic network node</p>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NodeStatus />
          <PerformanceMetrics />
        </div>

        <RewardHistory />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConnectedUsers />
          <MaintenanceTools />
        </div>
      </div>
    </div>
  )
}
