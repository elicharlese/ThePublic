"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Download, Upload, Coins } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/ui/animated-icon"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function UserStats() {
  return (
    <Card className="glass-card overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 animated-gradient"></div>
      <CardHeader>
        <CardTitle>Your Statistics</CardTitle>
        <CardDescription>Usage and rewards information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center">
              <AnimatedIcon icon={<Clock className="h-4 w-4 mr-2 text-primary" />} effect="none" />
              <span className="text-sm font-medium">Connected Time</span>
            </div>
            <span className="text-sm">
              <AnimatedCounter
                from={0}
                to={14}
                formatter={(v) => `${Math.floor(v)}h ${Math.round((v - Math.floor(v)) * 60)}m`}
              />
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center">
              <AnimatedIcon icon={<Download className="h-4 w-4 mr-2 text-primary" />} effect="bounce" />
              <span className="text-sm font-medium">Downloaded</span>
            </div>
            <span className="text-sm">
              <AnimatedCounter from={0} to={2.4} formatter={(v) => `${v.toFixed(1)} GB`} />
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center">
              <AnimatedIcon icon={<Upload className="h-4 w-4 mr-2 text-primary" />} effect="bounce" />
              <span className="text-sm font-medium">Uploaded</span>
            </div>
            <span className="text-sm">
              <AnimatedCounter from={0} to={0.8} formatter={(v) => `${v.toFixed(1)} GB`} />
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center">
              <AnimatedIcon icon={<Coins className="h-4 w-4 mr-2 text-primary" />} effect="pulse" />
              <span className="text-sm font-medium">Tokens Earned</span>
            </div>
            <span className="text-sm">
              <AnimatedCounter from={0} to={12.5} formatter={(v) => `${v.toFixed(1)} PUB`} />
            </span>
          </motion.div>

          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="text-xs text-muted-foreground mb-1">Data Usage</div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "35%" }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">3.2 GB of 10 GB</span>
              <span className="text-xs font-medium">35%</span>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
