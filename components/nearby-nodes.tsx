"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wifi, Signal } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Nodes</CardTitle>
        <CardDescription>Available network nodes in your vicinity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nodes.map((node) => (
            <div key={node.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5" />
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
                    <Signal className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{node.signal}%</span>
                  </div>
                  <Progress value={node.signal} className="h-1.5" />
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`}></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => connectToNode(node.id)}
                  disabled={node.status === "active"}
                >
                  {node.status === "active" ? "Connected" : "Connect"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
