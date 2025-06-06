"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Wifi, Signal, Activity, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedIcon } from "@/components/ui/animated-icon"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function NetworkStatus() {
  return (
    <Card className="glass-card overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 animated-gradient"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Network Status</CardTitle>
          <CardDescription>Current connection information</CardDescription>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
        </motion.div>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <AnimatedIcon icon={<Wifi className="h-4 w-4 mr-2 text-primary" />} effect="pulse" />
            <span className="text-sm font-medium">Connected to</span>
          </div>
          <span className="text-sm font-mono">ThePublic-Node-42</span>
        </motion.div>

        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <AnimatedIcon icon={<Signal className="h-4 w-4 mr-2 text-primary" />} effect="none" />
            <span className="text-sm font-medium">Signal Strength</span>
          </div>
          <div className="flex items-center">
            <motion.div
              className="w-1 h-3 bg-primary mx-0.5 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: 3 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />
            <motion.div
              className="w-1 h-4 bg-primary mx-0.5 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: 4 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            />
            <motion.div
              className="w-1 h-5 bg-primary mx-0.5 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: 5 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
            <motion.div
              className="w-1 h-6 bg-primary mx-0.5 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: 6 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
            <motion.div
              className="w-1 h-7 bg-muted mx-0.5 rounded-sm"
              initial={{ height: 0 }}
              animate={{ height: 7 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            />
          </div>
        </motion.div>

        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <AnimatedIcon icon={<Activity className="h-4 w-4 mr-2 text-primary" />} effect="shake" />
            <span className="text-sm font-medium">Speed</span>
          </div>
          <span className="text-sm">
            <AnimatedCounter from={0} to={85} duration={1.5} /> Mbps
          </span>
        </motion.div>

        <motion.div
          className="pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="text-xs text-muted-foreground mb-1">Connection Security</div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: "0%" }}
              animate={{ width: "95%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Blockchain Secured</span>
            <span className="text-xs font-medium">95%</span>
          </div>
        </motion.div>
      </CardContent>
      <CardFooter>
        <AnimatedButton variant="ghost" size="sm" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Connection Details
        </AnimatedButton>
      </CardFooter>
    </Card>
  )
}
