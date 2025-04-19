"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Laptop, Smartphone, Tablet, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
        return <Laptop className="h-5 w-5" />
      case "smartphone":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Laptop className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
        <CardDescription>Devices connected to ThePublic network</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getDeviceIcon(device.type)}
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-xs text-muted-foreground">{device.ipAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {device.connected ? (
                  <>
                    <Badge className="bg-green-500">Connected</Badge>
                    <Button variant="ghost" size="icon" onClick={() => disconnectDevice(device.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground">Last seen: {device.lastConnected}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
