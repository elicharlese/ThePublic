"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Server, Clock, AlertTriangle, Wifi } from "lucide-react"

export function NodeStatus() {
  const [isActive, setIsActive] = useState(true)
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)

  const toggleNodeStatus = () => {
    setIsActive(!isActive)
  }

  const toggleMaintenanceMode = () => {
    setIsMaintenanceMode(!isMaintenanceMode)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Node Status</CardTitle>
          <CardDescription>Current status of your node</CardDescription>
        </div>
        <Badge className={isActive ? "bg-green-500" : "bg-red-500"}>{isActive ? "Online" : "Offline"}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Node ID</span>
          </div>
          <span className="text-sm font-mono">node_8xft7UHoUJ4M</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Uptime</span>
          </div>
          <span className="text-sm">5d 14h 22m</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wifi className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Current Users</span>
          </div>
          <span className="text-sm">3 connected</span>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="node-active" className="flex items-center gap-2">
              <span>Node Active</span>
              {!isActive && (
                <span className="text-xs text-red-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Not earning rewards
                </span>
              )}
            </Label>
            <Switch id="node-active" checked={isActive} onCheckedChange={toggleNodeStatus} />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="maintenance-mode" className="flex items-center gap-2">
              <span>Maintenance Mode</span>
              {isMaintenanceMode && (
                <span className="text-xs text-yellow-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Limited rewards
                </span>
              )}
            </Label>
            <Switch id="maintenance-mode" checked={isMaintenanceMode} onCheckedChange={toggleMaintenanceMode} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Node Details
        </Button>
      </CardFooter>
    </Card>
  )
}
