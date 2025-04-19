"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import { useNetworkStore, type NetworkNode } from "@/store/network-store"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useTheme } from "next-themes"

// Simplified Node component
function Node({
  node,
  position,
  isSelected,
  onClick,
}: {
  node: NetworkNode
  position: [number, number, number]
  isSelected: boolean
  onClick: () => void
}) {
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

  // Determine node size based on type
  const getNodeSize = () => {
    const baseSize =
      {
        standard: 0.4,
        premium: 0.6,
        validator: 0.8,
      }[node.type] || 0.4

    return isSelected ? baseSize * 1.3 : baseSize
  }

  return (
    <Sphere args={[getNodeSize(), 16, 16]} position={position} onClick={onClick}>
      <meshStandardMaterial
        color={getNodeColor()}
        emissive={getNodeColor()}
        emissiveIntensity={isSelected ? 0.5 : 0.2}
        roughness={0.5}
        metalness={0.8}
      />
    </Sphere>
  )
}

// Simplified 3D scene
function NetworkScene() {
  const { nodes, selectedNode, selectNode } = useNetworkStore()
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  // Calculate node positions in 3D space (simplified)
  const nodePositions = nodes.map((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2
    const radius = 8
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius * 0.5
    const z = 0
    return { id: node.id, position: [x, y, z] as [number, number, number] }
  })

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId === selectedNode?.id ? null : nodeId)
  }

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={isDarkTheme ? 0.3 : 0.5} />

      {/* Directional light */}
      <directionalLight position={[10, 10, 10]} intensity={isDarkTheme ? 0.5 : 0.8} />

      {/* Network nodes */}
      {nodes.map((node, index) => {
        const position = nodePositions[index].position
        return (
          <Node
            key={node.id}
            node={node}
            position={position}
            isSelected={selectedNode?.id === node.id}
            onClick={() => handleNodeClick(node.id)}
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
        autoRotate={!selectedNode}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

// Main component that wraps the 3D visualization
export function Network3DVisualizationSimple({
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
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={[isDarkTheme ? "#111827" : "#f9fafb"]} />
        <NetworkScene />
      </Canvas>

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
            <h3 className="font-medium">{selectedNode.name}</h3>
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

            <div className="text-xs text-muted-foreground mt-2">
              {selectedNode.location.city}, {selectedNode.location.country}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
