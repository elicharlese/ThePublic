"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Smartphone, Laptop, Tablet, MoreVertical, Clock, Activity, Ban } from "lucide-react"

type User = {
  id: string
  deviceName: string
  deviceType: "smartphone" | "laptop" | "tablet"
  connectionTime: string
  dataUsage: string
  status: "active" | "idle"
}

export function ConnectedUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "user1",
      deviceName: "iPhone 13",
      deviceType: "smartphone",
      connectionTime: "45m",
      dataUsage: "128 MB",
      status: "active",
    },
    {
      id: "user2",
      deviceName: "MacBook Pro",
      deviceType: "laptop",
      connectionTime: "2h 15m",
      dataUsage: "1.2 GB",
      status: "active",
    },
    {
      id: "user3",
      deviceName: "iPad Air",
      deviceType: "tablet",
      connectionTime: "30m",
      dataUsage: "256 MB",
      status: "idle",
    },
  ])

  const disconnectUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartphone":
        return <Smartphone className="h-4 w-4" />
      case "laptop":
        return <Laptop className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Smartphone className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Users</CardTitle>
        <CardDescription>Users currently connected to your node</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(user.deviceType)}
                  <div>
                    <div className="font-medium">{user.deviceName}</div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {user.connectionTime}
                      </span>
                      <span className="flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        {user.dataUsage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" ? "Active" : "Idle"}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Limit Bandwidth</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => disconnectUser(user.id)} className="text-red-500">
                        <Ban className="h-4 w-4 mr-2" />
                        Disconnect User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No users currently connected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
