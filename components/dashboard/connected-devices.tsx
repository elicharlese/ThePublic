"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone, Tablet, X, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedList } from "@/components/ui/animated-list"
import { AnimatedIcon } from "@/components/ui/animated-icon"

type Device = {
  id: string
  name: string
  type: "laptop" | "smartphone" | "tablet"
  connected: boolean
  lastConnected: string
  ipAddress: string
}

export function ConnectedDevices() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "MacBook Pro",
      type: "laptop",
      connected: true,
      lastConnected: "Now",
      ipAddress: "192.168.1.101",
    },
    {
      id: "2",
      name: "iPhone 13",
      type: "smartphone",
      connected: true,
      lastConnected: "Now",
      ipAddress: "192.168.1.102",
    },
    {
      id: "3",
      name: "iPad Pro",
      type: "tablet",
      connected: false,
      lastConnected: "2 hours ago",
      ipAddress: "192.168.1.103",
    },
  ])

  const disconnectDevice = (id: string) => {
    setDevices(
      devices.map((device) => (device.id === id ? { ...device, connected: false, lastConnected: "Just now" } : device)),
    )
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="h-5 w-5 text-primary" />
      case "smartphone":
        return <Smartphone className="h-5 w-5 text-primary" />
      case "tablet":
        return <Tablet className="h-5 w-5 text-primary" />
      default:
        return <Laptop className="h-5 w-5 text-primary" />
    }
  }

  const deviceItems = devices.map((device) => ({
    id: device.id,
    content: (
      <div className="flex items-center justify-between p-3 border rounded-lg card-hover">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <AnimatedIcon icon={getDeviceIcon(device.type)} effect={device.connected ? "pulse" : "none"} />
          </div>
          <div>
            <div className="font-medium">{device.name}</div>
            <div className="text-xs text-muted-foreground">{device.ipAddress}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {device.connected ? (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
              </motion.div>
              <AnimatedButton
                variant="ghost"
                size="icon"
                onClick={() => disconnectDevice(device.id)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </AnimatedButton>
            </>
          ) : (
            <div className="text-xs text-muted-foreground">Last seen: {device.lastConnected}</div>
          )}
        </div>
      </div>
    ),
  }))

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>Devices connected to ThePublic network</CardDescription>
        </div>
        <AnimatedButton size="sm" variant="outline" className="rounded-full">
          <Plus className="h-4 w-4 mr-1" /> Add Device
        </AnimatedButton>
      </CardHeader>
      <CardContent>
        <AnimatedList items={deviceItems} staggerDelay={0.1} />
      </CardContent>
    </Card>
  )
}
