"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Cpu, HardDrive, Activity, Zap, Wifi } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the charts
const bandwidthData = [
  { time: "00:00", value: 15 },
  { time: "04:00", value: 8 },
  { time: "08:00", value: 25 },
  { time: "12:00", value: 45 },
  { time: "16:00", value: 60 },
  { time: "20:00", value: 35 },
  { time: "24:00", value: 20 },
]

const usersData = [
  { time: "00:00", value: 1 },
  { time: "04:00", value: 0 },
  { time: "08:00", value: 2 },
  { time: "12:00", value: 5 },
  { time: "16:00", value: 7 },
  { time: "20:00", value: 4 },
  { time: "24:00", value: 2 },
]

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>System and network performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="system">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm">42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <span className="text-sm">1.8 GB / 4 GB</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <span className="text-sm">12.4 GB / 64 GB</span>
                </div>
                <Progress value={19} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Temperature</span>
                  </div>
                  <span className="text-sm">48°C</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Bandwidth Usage</span>
                  </div>
                  <span className="text-sm">35 Mbps / 100 Mbps</span>
                </div>

                <div className="h-[150px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bandwidthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-center text-muted-foreground mt-2">
                  Bandwidth usage over the last 24 hours (Mbps)
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Wifi className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Connected Users</span>
                  </div>
                  <span className="text-sm">3 current / 7 peak</span>
                </div>

                <div className="h-[150px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-center text-muted-foreground mt-2">
                  Connected users over the last 24 hours
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
