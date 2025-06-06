"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNetworkStore } from "@/store/network-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowDown, ArrowUp } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function NetworkActivity() {
  const { stats, fetchNetworkData } = useNetworkStore()
  const [dataPoints, setDataPoints] = useState<number[]>(Array(20).fill(0))
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)

  useEffect(() => {
    fetchNetworkData()

    // Simulate real-time data flow
    const interval = setInterval(() => {
      // Generate random network activity
      const newUpload = Math.floor(Math.random() * 50) + 10
      const newDownload = Math.floor(Math.random() * 80) + 20

      setUploadSpeed(newUpload)
      setDownloadSpeed(newDownload)

      // Add new data point (total bandwidth)
      setDataPoints((prev) => {
        const newPoints = [...prev, newUpload + newDownload]
        if (newPoints.length > 20) {
          return newPoints.slice(1)
        }
        return newPoints
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [fetchNetworkData])

  // Calculate the max value for scaling
  const maxValue = Math.max(...dataPoints, 1)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Network Activity</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-green-500" />
              <span className="text-sm">Download</span>
            </div>
            <div className="text-sm font-medium">
              <AnimatedCounter
                from={0}
                to={downloadSpeed}
                duration={0.5}
                formatter={(value) => `${Math.round(value)} Mbps`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Upload</span>
            </div>
            <div className="text-sm font-medium">
              <AnimatedCounter
                from={0}
                to={uploadSpeed}
                duration={0.5}
                formatter={(value) => `${Math.round(value)} Mbps`}
              />
            </div>
          </div>

          <div className="h-16 flex items-end gap-1">
            {dataPoints.map((point, index) => (
              <motion.div
                key={index}
                className="bg-primary/80 rounded-t-sm w-full"
                initial={{ height: 0 }}
                animate={{ height: `${(point / maxValue) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center">Real-time network traffic (last 40 seconds)</div>
        </div>
      </CardContent>
    </Card>
  )
}
