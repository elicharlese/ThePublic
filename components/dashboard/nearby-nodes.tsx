"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Wifi, Signal, MapPin } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { AnimatedList } from "@/components/ui/animated-list"
import { AnimatedIcon } from "@/components/ui/animated-icon"

type Node = {
  id: string
  name: string
  distance: string
  signal: number
  users: number
  status: "active" | "busy" | "available"
}

export function NearbyNodes() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      name: "ThePublic-Node-42",
      distance: "15m",
      signal: 80,
      users: 3,
      status: "active",
    },
    {
      id: "2",
      name: "ThePublic-Node-17",
      distance: "50m",
      signal: 65,
      users: 8,
      status: "busy",
    },
    {
      id: "3",
      name: "ThePublic-Node-23",
      distance: "120m",
      signal: 40,
      users: 2,
      status: "available",
    },
    {
      id: "4",
      name: "ThePublic-Node-09",
      distance: "200m",
      signal: 25,
      users: 1,
      status: "available",
    },
  ])

  const connectToNode = (id: string) => {
    // In a real app, this would connect to the node
    console.log(`Connecting to node ${id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "available":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const nodeItems = nodes.map((node) => ({
    id: node.id,
    content: (
      <div className="flex items-center justify-between p-3 border rounded-lg card-hover">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <AnimatedIcon
              icon={<Wifi className="h-5 w-5 text-primary" />}
              effect={node.status === "active" ? "pulse" : "none"}
            />
          </div>
          <div>
            <div className="font-medium">{node.name}</div>
            <div className="text-xs text-muted-foreground">
              Distance: {node.distance} • Users: {node.users}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24">
            <div className="flex items-center justify-between mb-1">
              <Signal className="h-3 w-3 text-primary" />
              <span className="text-xs">{node.signal}%</span>
            </div>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }}>
              <Progress value={node.signal} className="h-1.5" />
            </motion.div>
          </div>
          <motion.div
            className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`}
            animate={{
              scale: node.status === "active" ? [1, 1.2, 1] : 1,
              opacity: node.status === "active" ? [1, 0.7, 1] : 1,
            }}
            transition={{ duration: 2, repeat: node.status === "active" ? Number.POSITIVE_INFINITY : 0 }}
          />
          <AnimatedButton
            variant={node.status === "active" ? "secondary" : "outline"}
            size="sm"
            onClick={() => connectToNode(node.id)}
            disabled={node.status === "active"}
            className="rounded-full"
          >
            {node.status === "active" ? "Connected" : "Connect"}
          </AnimatedButton>
        </div>
      </div>
    ),
  }))

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nearby Nodes</CardTitle>
          <CardDescription>Available network nodes in your vicinity</CardDescription>
        </div>
        <AnimatedButton size="sm" variant="outline" className="rounded-full">
          <MapPin className="h-4 w-4 mr-1" /> View Map
        </AnimatedButton>
      </CardHeader>
      <CardContent>
        <AnimatedList items={nodeItems} staggerDelay={0.1} />
      </CardContent>
    </Card>
  )
}
