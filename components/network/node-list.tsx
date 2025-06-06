"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNetworkStore, type NetworkNode } from "@/store/network-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi, Search, ArrowUpDown } from "lucide-react"
import { AnimatedList } from "@/components/ui/animated-list"
// Verify the import path is correct
import { listItemHover, listItemTransition } from "@/lib/micro-interactions"

interface NodeListProps {
  onNodeSelect?: (node: NetworkNode) => void
  className?: string
}

export function NodeList({ onNodeSelect, className = "" }: NodeListProps) {
  const { nodes, selectNode, fetchNetworkData } = useNetworkStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    fetchNetworkData()
  }, [fetchNetworkData])

  const handleNodeClick = (node: NetworkNode) => {
    selectNode(node.id)
    if (onNodeSelect) {
      onNodeSelect(node)
    }
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const filteredAndSortedNodes = nodes
    .filter((node) => {
      // Apply search filter
      if (
        searchTerm &&
        !node.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !node.location.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !node.location.country.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Apply status filter
      if (statusFilter !== "all" && node.status !== statusFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "users":
          comparison = a.connectedUsers - b.connectedUsers
          break
        case "uptime":
          comparison = a.uptime - b.uptime
          break
        case "location":
          comparison = a.location.country.localeCompare(b.location.country)
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-400"
      case "busy":
        return "bg-yellow-500"
      case "maintenance":
        return "bg-blue-500"
      default:
        return "bg-gray-400"
    }
  }

  const nodeItems = filteredAndSortedNodes.map((node) => ({
    id: node.id,
    content: (
      <motion.div
        whileHover={listItemHover}
        whileTap={{ scale: 0.98 }}
        transition={listItemTransition}
        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => handleNodeClick(node)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center bg-primary/10`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Wifi className="h-4 w-4 text-primary" />
            </motion.div>
            <motion.div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(node.status)} border-2 border-background`}
              animate={
                node.status === "active"
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: node.status === "active" ? Number.POSITIVE_INFINITY : 0 }}
            />
          </div>
          <div>
            <div className="font-medium">{node.name}</div>
            <div className="text-xs text-muted-foreground">
              {node.location.city}, {node.location.country}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{node.type}</Badge>
          {node.status === "active" && (
            <motion.div
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {node.connectedUsers} users
            </motion.div>
          )}
        </div>
      </motion.div>
    ),
  }))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Network Nodes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Input
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </motion.div>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="uptime">Uptime</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: sortDirection === "asc" ? 0 : 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="outline" size="icon" onClick={toggleSortDirection}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="h-[400px] overflow-y-auto pr-1">
            {nodeItems.length > 0 ? (
              <AnimatedList items={nodeItems} staggerDelay={0.05} />
            ) : (
              <motion.div
                className="flex items-center justify-center h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-muted-foreground">No nodes found</p>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
