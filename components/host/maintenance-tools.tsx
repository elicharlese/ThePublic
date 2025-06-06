"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Shield, Terminal, Download, RotateCw, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export function MaintenanceTools() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)
  const [lastChecked, setLastChecked] = useState("2 hours ago")
  const [securityStatus, setSecurityStatus] = useState("Secure")

  const checkForUpdates = () => {
    setIsUpdating(true)

    // Simulate update progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUpdateProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUpdating(false)
        setLastChecked("Just now")
      }
    }, 300)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Tools</CardTitle>
        <CardDescription>Tools to maintain your node</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Software Version</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">v1.2.5</span>
              <Badge status={securityStatus} />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last checked: {lastChecked}</span>
            {isUpdating && <span>Checking for updates...</span>}
          </div>

          {isUpdating && <Progress value={updateProgress} className="h-2 mt-2" />}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-start" onClick={checkForUpdates} disabled={isUpdating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Check for Updates
          </Button>

          <Button variant="outline" size="sm" className="justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Security Scan
          </Button>

          <Button variant="outline" size="sm" className="justify-start">
            <Terminal className="h-4 w-4 mr-2" />
            Diagnostics
          </Button>

          <Button variant="outline" size="sm" className="justify-start">
            <RotateCw className="h-4 w-4 mr-2" />
            Restart Node
          </Button>
        </div>

        <div className="border rounded-lg p-3 mt-4">
          <h4 className="text-sm font-medium mb-2">System Logs</h4>
          <div className="bg-muted rounded-md p-2 text-xs font-mono h-[100px] overflow-y-auto">
            <p>[2023-04-18 14:32:15] Node started successfully</p>
            <p>[2023-04-18 14:32:18] Connected to ThePublic network</p>
            <p>[2023-04-18 15:45:22] New user connected (user1)</p>
            <p>[2023-04-18 16:12:05] Bandwidth usage spike detected</p>
            <p>[2023-04-18 17:30:11] Daily rewards calculated: 3.5 PUB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Badge({ status }: { status: string }) {
  if (status === "Secure") {
    return (
      <div className="flex items-center text-green-500 text-xs">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Up to date
      </div>
    )
  } else if (status === "Update Available") {
    return (
      <div className="flex items-center text-yellow-500 text-xs">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Update available
      </div>
    )
  } else {
    return (
      <div className="flex items-center text-red-500 text-xs">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Update required
      </div>
    )
  }
}
