"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useNetworkStore } from "@/store/network-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, Users, Globe, Activity } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { AnimatedIcon } from "@/components/ui/animated-icon"

export function NetworkStatsPanel() {
  const { stats, fetchNetworkData } = useNetworkStore()

  useEffect(() => {
    fetchNetworkData()
  }, [fetchNetworkData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="flex flex-col items-center p-3 rounded-lg border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatedIcon icon={<Wifi className="h-5 w-5 text-primary mb-2" />} effect="pulse" />
            <div className="text-2xl font-bold">
              <AnimatedCounter from={0} to={stats.activeNodes} duration={1.5} />
            </div>
            <div className="text-xs text-muted-foreground">Active Nodes</div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center p-3 rounded-lg border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatedIcon icon={<Users className="h-5 w-5 text-primary mb-2" />} effect="none" />
            <div className="text-2xl font-bold">
              <AnimatedCounter from={0} to={stats.totalUsers} duration={1.5} />
            </div>
            <div className="text-xs text-muted-foreground">Connected Users</div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center p-3 rounded-lg border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatedIcon icon={<Globe className="h-5 w-5 text-primary mb-2" />} effect="none" />
            <div className="text-2xl font-bold">
              <AnimatedCounter from={0} to={stats.totalCountries} duration={1.5} />
            </div>
            <div className="text-xs text-muted-foreground">Countries</div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center p-3 rounded-lg border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatedIcon icon={<Activity className="h-5 w-5 text-primary mb-2" />} effect="shake" />
            <div className="text-2xl font-bold">
              <AnimatedCounter
                from={0}
                to={stats.totalBandwidth}
                duration={1.5}
                formatter={(value) => `${Math.round(value)} Mbps`}
              />
            </div>
            <div className="text-xs text-muted-foreground">Total Bandwidth</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
