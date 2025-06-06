"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Sphere, Line, Html } from "@react-three/drei"
import type * as THREE from "three"
import { useNetworkStore, type NetworkNode, type NetworkConnection } from "@/store/network-store"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, RotateCw, X } from "lucide-react"
import { useTheme } from "next-themes"

// Node component that represents a network node in 3D space
function Node({
  node,
  position,
  isSelected,
  isHovered,
  onClick,
  onHover,
  onLeave,
}: {
  node: NetworkNode
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onClick: () => void
  onHover: () => void
  onLeave: () => void
}) {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  // Determine node color based on status
  const getNodeColor = () => {
    switch (node.status) {
      case "active":
        return "#8b5cf6" // purple-500
      case "busy":
        return "#a78bfa" // purple-400
      case "maintenance":
        return "#c4b5fd" // purple-300
      case "inactive":
      default:
        return "#9ca3af" // gray-400
    }
  }

  // Determine node size based on type and selection state
  const getNodeSize = () => {
    const baseSize =
      {
        standard: 0.4,
        premium: 0.6,
        validator: 0.8,
      }[node.type] || 0.4

    return isSelected || isHovered ? baseSize * 1.3 : baseSize
  }

  // Pulse animation for active nodes
  const [scale, setScale] = useState(1)
  useFrame((state) => {
    if (node.status === "active" || node.status === "busy") {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      setScale(pulse)
    }
  })

  return (
    <group position={position}>
      {/* Node sphere */}
      <Sphere args={[getNodeSize(), 16, 16]} onClick={onClick} onPointerOver={onHover} onPointerOut={onLeave}>
        <meshStandardMaterial
          color={getNodeColor()}
          emissive={getNodeColor()}
          emissiveIntensity={isSelected || isHovered ? 0.5 : 0.2}
          roughness={0.5}
          metalness={0.8}
        />
      </Sphere>

      {/* Pulse effect for active nodes */}
      {(node.status === "active" || node.status === "busy") && (
        <Sphere args={[getNodeSize() * 1.5, 16, 16]} scale={scale}>
          <meshStandardMaterial color={getNodeColor()} transparent={true} opacity={0.15} roughness={1} metalness={0} />
        </Sphere>
      )}

      {/* Node label */}
      <Text
        position={[0, getNodeSize() + 0.3, 0]}
        fontSize={0.3}
        color={isDarkTheme ? "white" : "black"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isDarkTheme ? "black" : "white"}
        visible={isSelected || isHovered}
      >
        {node.name}
      </Text>

      {/* Connection count indicator */}
      {node.connectedUsers > 0 && (
        <Html position={[getNodeSize() * 0.7, getNodeSize() * 0.7, getNodeSize() * 0.7]}>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } border-2 ${isSelected || isHovered ? "border-primary" : "border-gray-300"}`}
          >
            {node.connectedUsers}
          </div>
        </Html>
      )}
    </group>
  )
}

// Connection component that represents a link between nodes
function Connection({
  start,
  end,
  strength,
  traffic,
  isHighlighted,
}: {
  start: [number, number, number]
  end: [number, number, number]
  strength: number
  traffic: number
  isHighlighted: boolean
}) {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  // Calculate line thickness based on traffic
  const thickness = Math.max(0.02, Math.min(0.1, traffic / 200))

  // Animate data packets along the connection
  const packetRef = useRef<THREE.Mesh>(null)
  const [packetProgress, setPacketProgress] = useState(0)

  useFrame(() => {
    if (isHighlighted && traffic > 0) {
      setPacketProgress((prev) => (prev >= 1 ? 0 : prev + 0.01 * (traffic / 30)))

      if (packetRef.current) {
        // Interpolate position along the line
        const x = start[0] + (end[0] - start[0]) * packetProgress
        const y = start[1] + (end[1] - start[1]) * packetProgress
        const z = start[2] + (end[2] - start[2]) * packetProgress
        packetRef.current.position.set(x, y, z)
      }
    }
  })

  return (
    <group>
      {/* Connection line */}
      <Line
        points={[start, end]}
        color={isHighlighted ? "#8b5cf6" : isDarkTheme ? "#4b5563" : "#d1d5db"}
        lineWidth={isHighlighted ? thickness * 2 : thickness}
        transparent
        opacity={isHighlighted ? 0.8 : 0.3}
      />

      {/* Data packet animation */}
      {isHighlighted && traffic > 0 && (
        <mesh ref={packetRef}>
          <sphereGeometry args={[thickness * 3, 8, 8]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  )
}

// Main 3D scene component
function NetworkScene() {
  const { nodes, connections, selectedNode, hoveredNode, selectNode, hoverNode } = useNetworkStore()
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  // Calculate node positions in 3D space
  const nodePositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {}

    // Position nodes in a spherical layout
    nodes.forEach((node, index) => {
      // Use golden ratio to distribute points evenly on a sphere
      const phi = Math.acos(-1 + (2 * index) / nodes.length)
      const theta = Math.sqrt(nodes.length * Math.PI) * phi

      // Calculate radius based on node type
      let radius = 10
      if (node.type === "premium") radius = 8
      if (node.type === "validator") radius = 6

      // Convert to Cartesian coordinates
      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      positions[node.id] = [x, y, z]
    })

    return positions
  }, [nodes])

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId === selectedNode?.id ? null : nodeId)
  }

  // Handle node hover
  const handleNodeHover = (nodeId: string) => {
    hoverNode(nodeId)
  }

  // Handle node leave
  const handleNodeLeave = () => {
    hoverNode(null)
  }

  // Determine if a connection should be highlighted
  const isConnectionHighlighted = (connection: NetworkConnection) => {
    if (!selectedNode && !hoveredNode) return false
    const relevantNodeId = selectedNode?.id || hoveredNode?.id
    return connection.source === relevantNodeId || connection.target === relevantNodeId
  }

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={isDarkTheme ? 0.3 : 0.5} />

      {/* Directional light */}
      <directionalLight position={[10, 10, 10]} intensity={isDarkTheme ? 0.5 : 0.8} />

      {/* Connections between nodes */}
      {connections.map((connection) => {
        const startPosition = nodePositions[connection.source]
        const endPosition = nodePositions[connection.target]

        if (!startPosition || !endPosition) return null

        return (
          <Connection
            key={`${connection.source}-${connection.target}`}
            start={startPosition}
            end={endPosition}
            strength={connection.strength}
            traffic={connection.traffic}
            isHighlighted={isConnectionHighlighted(connection)}
          />
        )
      })}

      {/* Network nodes */}
      {nodes.map((node) => {
        const position = nodePositions[node.id]
        if (!position) return null

        return (
          <Node
            key={node.id}
            node={node}
            position={position}
            isSelected={selectedNode?.id === node.id}
            isHovered={hoveredNode?.id === node.id}
            onClick={() => handleNodeClick(node.id)}
            onHover={() => handleNodeHover(node.id)}
            onLeave={handleNodeLeave}
          />
        )
      })}

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={!selectedNode && !hoveredNode}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

// Camera reset component
function CameraReset() {
  const { camera } = useThree()

  const resetCamera = () => {
    camera.position.set(15, 0, 0)
    camera.lookAt(0, 0, 0)
  }

  return (
    <Html position={[0, 0, 0]} center>
      <button
        onClick={resetCamera}
        className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border rounded-full p-2 shadow-lg"
      >
        <RotateCw className="h-4 w-4" />
      </button>
    </Html>
  )
}

// Main component that wraps the 3D visualization
export function Network3DVisualization({
  height = "600px",
  className = "",
}: {
  height?: string | number
  className?: string
}) {
  const { nodes, selectedNode, selectNode, fetchNetworkData } = useNetworkStore()
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="mt-2 text-sm">Loading network data...</span>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas camera={{ position: [15, 0, 0], fov: 60 }} gl={{ antialias: true }} shadows className="bg-transparent">
        <color attach="background" args={[isDarkTheme ? "#111827" : "#f9fafb"]} />
        <fog attach="fog" args={[isDarkTheme ? "#111827" : "#f9fafb", 15, 30]} />
        <NetworkScene />
        <CameraReset />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          onClick={() => selectNode(null)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Node details panel */}
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
              <div
                className={`w-3 h-3 rounded-full ${
                  selectedNode.status === "active"
                    ? "bg-green-500"
                    : selectedNode.status === "busy"
                      ? "bg-yellow-500"
                      : selectedNode.status === "maintenance"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                }`}
              ></div>
              <h3 className="font-medium">{selectedNode.name}</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => selectNode(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm capitalize">{selectedNode.status}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm capitalize">{selectedNode.type}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connected Users</span>
              <span className="text-sm">{selectedNode.connectedUsers}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bandwidth</span>
              <span className="text-sm">{selectedNode.bandwidth} Mbps</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm">{selectedNode.uptime}%</span>
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              {selectedNode.location.city}, {selectedNode.location.country}
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border shadow-md p-3">
        <div className="text-xs font-medium mb-2">Node Status</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-xs">Inactive</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export as default for dynamic import
export default Network3DVisualization
