"use client"

import { useState, useEffect } from "react"
import { useNetworkStore } from "@/store/network-store"
import { motion } from "framer-motion"

export function NetworkVisualizationFallback({
  height = "600px",
  className = "",
}: {
  height?: string | number
  className?: string
}) {
  const { nodes, connections, selectedNode, selectNode, fetchNetworkData } = useNetworkStore()
  const [isLoading, setIsLoading] = useState(true)

  // Fetch network data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchNetworkData()
      setIsLoading(false)
    }

    loadData()
  }, [fetchNetworkData])

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Loading overlay */}
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="mt-2 text-sm">Loading network data...</span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-2">Network Visualization</h3>
            <p className="text-muted-foreground">
              The 3D visualization could not be loaded. Here's a simplified view of the network.
            </p>
          </div>

          <div className="w-full max-w-3xl bg-card rounded-lg border shadow-sm p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-background rounded-md p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{nodes.length}</div>
                <div className="text-sm text-muted-foreground">Network Nodes</div>
              </div>
              <div className="bg-background rounded-md p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{connections.length}</div>
                <div className="text-sm text-muted-foreground">Connections</div>
              </div>
            </div>

            <h4 className="font-medium mb-3">Network Nodes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedNode?.id === node.id ? "bg-primary/10 border-primary" : "bg-background hover:bg-primary/5"
                  }`}
                  onClick={() => selectNode(node.id === selectedNode?.id ? null : node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          node.status === "active"
                            ? "bg-green-500"
                            : node.status === "busy"
                              ? "bg-yellow-500"
                              : node.status === "maintenance"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <span className="font-medium">{node.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{node.type}</span>
                  </div>

                  {selectedNode?.id === node.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t text-sm"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-muted-foreground">Status:</span> {node.status}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Users:</span> {node.connectedUsers}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bandwidth:</span> {node.bandwidth} Mbps
                        </div>
                        <div>
                          <span className="text-muted-foreground">Uptime:</span> {node.uptime}%
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {node.location.city}, {node.location.country}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
