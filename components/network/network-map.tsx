"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps"
import { useNetworkStore, type NetworkNode } from "@/store/network-store"
import { Wifi, Users, Activity, Clock, Info } from "lucide-react"
import { AnimatedIcon } from "@/components/ui/animated-icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// World map topology
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-400",
  busy: "bg-yellow-500",
  maintenance: "bg-blue-500",
}

const nodeTypeSize = {
  standard: 8,
  premium: 12,
  validator: 16,
}

interface NetworkMapProps {
  height?: number | string
  interactive?: boolean
  showControls?: boolean
  showNodeDetails?: boolean
  showConnections?: boolean
  className?: string
}

export function NetworkMap({
  height = 500,
  interactive = true,
  showControls = true,
  showNodeDetails = true,
  showConnections = true,
  className = "",
}: NetworkMapProps) {
  const { nodes, connections, selectedNode, hoveredNode, selectNode, hoverNode, fetchNetworkData } = useNetworkStore()

  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchNetworkData()
      setIsLoading(false)
    }

    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchNetworkData, 30000)

    return () => clearInterval(interval)
  }, [fetchNetworkData])

  const handleZoomIn = () => {
    if (position.zoom >= 4) return
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }))
  }

  const handleZoomOut = () => {
    if (position.zoom <= 0.5) return
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }))
  }

  const handleMoveEnd = (position: any) => {
    setPosition(position)
  }

  const handleResetPosition = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 })
  }

  const handleNodeClick = (node: NetworkNode) => {
    if (!interactive) return
    selectNode(selectedNode?.id === node.id ? null : node.id)
  }

  const handleNodeHover = (node: NetworkNode | null) => {
    if (!interactive) return
    hoverNode(node?.id || null)
  }

  // Filter connections to only show those related to the selected or hovered node
  const visibleConnections = useMemo(() => {
    if (!showConnections) return []

    if (selectedNode || hoveredNode) {
      const relevantNodeId = (selectedNode || hoveredNode)?.id
      return connections.filter((conn) => conn.source === relevantNodeId || conn.target === relevantNodeId)
    }

    return connections
  }, [connections, selectedNode, hoveredNode, showConnections])

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="mt-2 text-sm">Loading network data...</span>
          </div>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 150 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          translateExtent={[
            [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
            [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
          ]}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#2C3440"
                  stroke="#1A202C"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Connection lines */}
          {visibleConnections.map((connection) => {
            const source = nodes.find((node) => node.id === connection.source)
            const target = nodes.find((node) => node.id === connection.target)

            if (!source || !target) return null

            return (
              <Line
                key={`${connection.source}-${connection.target}`}
                from={[source.location.longitude, source.location.latitude]}
                to={[target.location.longitude, target.location.latitude]}
                stroke="#8B5CF6"
                strokeWidth={connection.traffic / 20}
                strokeOpacity={0.5}
                strokeLinecap="round"
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id
            const isHovered = hoveredNode?.id === node.id
            const isActive = node.status === "active" || node.status === "busy"
            const nodeSize = nodeTypeSize[node.type]

            return (
              <Marker
                key={node.id}
                coordinates={[node.location.longitude, node.location.latitude]}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => handleNodeHover(node)}
                onMouseLeave={() => handleNodeHover(null)}
              >
                <g>
                  {/* Pulse animation for active nodes */}
                  {isActive && (
                    <motion.circle
                      r={nodeSize * 2}
                      fill={statusColors[node.status]}
                      opacity={0.2}
                      animate={{
                        r: [nodeSize * 2, nodeSize * 3, nodeSize * 2],
                        opacity: [0.2, 0, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <motion.circle
                    r={nodeSize}
                    fill={statusColors[node.status]}
                    stroke={isSelected || isHovered ? "#fff" : "transparent"}
                    strokeWidth={isSelected || isHovered ? 2 : 0}
                    animate={{
                      r: isSelected || isHovered ? nodeSize * 1.3 : nodeSize,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                  />

                  {/* Node icon */}
                  <Wifi
                    style={{
                      transform: `translate(-${nodeSize / 2}px, -${nodeSize / 2}px)`,
                      width: nodeSize,
                      height: nodeSize,
                      color: "#fff",
                    }}
                  />
                </g>
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Map controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          >
            <span className="text-lg">+</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          >
            <span className="text-lg">-</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleResetPosition}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Node details panel */}
      {showNodeDetails && (
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80 bg-background/80 backdrop-blur-md rounded-lg border shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusColors[selectedNode.status]}`}></div>
                  <h3 className="font-medium">{selectedNode.name}</h3>
                </div>
                <Badge variant="outline">{selectedNode.type}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AnimatedIcon icon={<Users className="h-4 w-4 text-primary" />} effect="none" />
                    <span className="text-sm">Connected Users</span>
                  </div>
                  <span className="text-sm font-medium">{selectedNode.connectedUsers}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AnimatedIcon icon={<Activity className="h-4 w-4 text-primary" />} effect="none" />
                    <span className="text-sm">Bandwidth</span>
                  </div>
                  <span className="text-sm font-medium">{selectedNode.bandwidth} Mbps</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AnimatedIcon icon={<Clock className="h-4 w-4 text-primary" />} effect="none" />
                    <span className="text-sm">Uptime</span>
                  </div>
                  <span className="text-sm font-medium">{selectedNode.uptime}%</span>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  {selectedNode.location.city}, {selectedNode.location.country}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => selectNode(null)}>
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
