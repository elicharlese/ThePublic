import { create } from "zustand"

// Define types for network data
export interface NetworkNode {
  id: string
  name: string
  type: "standard" | "premium" | "validator"
  status: "active" | "busy" | "maintenance" | "inactive"
  connectedUsers: number
  bandwidth: number
  uptime: number
  location: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
}

export interface NetworkConnection {
  source: string
  target: string
  strength: number
  traffic: number
}

export interface NetworkStats {
  activeNodes: number
  totalUsers: number
  totalCountries: number
  totalBandwidth: number
}

interface NetworkState {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
  stats: NetworkStats
  selectedNode: NetworkNode | null
  hoveredNode: NetworkNode | null
  fetchNetworkData: () => Promise<void>
  selectNode: (nodeId: string | null) => void
  hoverNode: (nodeId: string | null) => void
}

// Create mock network data
const generateMockNetworkData = () => {
  const nodeCount = 30
  const nodes: NetworkNode[] = []
  const connections: NetworkConnection[] = []
  const countries = ["USA", "UK", "Germany", "Japan", "Australia", "Canada", "France", "Brazil", "India", "Singapore"]
  const cities = {
    USA: ["New York", "San Francisco", "Chicago", "Los Angeles", "Seattle"],
    UK: ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow"],
    Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
    Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    France: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
    Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza"],
    India: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
    Singapore: ["Singapore City"],
  }

  // Generate nodes
  for (let i = 0; i < nodeCount; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)]
    const citiesInCountry = cities[country as keyof typeof cities]
    const city = citiesInCountry[Math.floor(Math.random() * citiesInCountry.length)]

    const nodeTypes = ["standard", "standard", "standard", "premium", "premium", "validator"] as const
    const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)]

    const nodeStatuses = ["active", "active", "active", "busy", "maintenance", "inactive"] as const
    const nodeStatus = nodeStatuses[Math.floor(Math.random() * nodeStatuses.length)]

    nodes.push({
      id: `node-${i + 1}`,
      name: `ThePublic-Node-${i + 1}`,
      type: nodeType,
      status: nodeStatus,
      connectedUsers: nodeStatus === "active" || nodeStatus === "busy" ? Math.floor(Math.random() * 10) : 0,
      bandwidth: Math.floor(Math.random() * 100) + 50,
      uptime: Math.floor(Math.random() * 20) + 80,
      location: {
        city,
        country,
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
      },
    })
  }

  // Generate connections (not all nodes will be connected)
  const activeNodes = nodes.filter((node) => node.status === "active" || node.status === "busy")

  // Ensure all active nodes have at least one connection
  activeNodes.forEach((node, index) => {
    // Connect to a random node that's not itself
    let targetIndex
    do {
      targetIndex = Math.floor(Math.random() * activeNodes.length)
    } while (targetIndex === index)

    connections.push({
      source: node.id,
      target: activeNodes[targetIndex].id,
      strength: Math.floor(Math.random() * 100),
      traffic: Math.floor(Math.random() * 200),
    })
  })

  // Add some more random connections
  for (let i = 0; i < nodeCount / 2; i++) {
    const sourceIndex = Math.floor(Math.random() * activeNodes.length)
    let targetIndex
    do {
      targetIndex = Math.floor(Math.random() * activeNodes.length)
    } while (targetIndex === sourceIndex)

    connections.push({
      source: activeNodes[sourceIndex].id,
      target: activeNodes[targetIndex].id,
      strength: Math.floor(Math.random() * 100),
      traffic: Math.floor(Math.random() * 200),
    })
  }

  // Calculate stats
  const stats = {
    activeNodes: activeNodes.length,
    totalUsers: activeNodes.reduce((sum, node) => sum + node.connectedUsers, 0),
    totalCountries: new Set(nodes.map((node) => node.location.country)).size,
    totalBandwidth: activeNodes.reduce((sum, node) => sum + node.bandwidth, 0),
  }

  return { nodes, connections, stats }
}

// Create the store
export const useNetworkStore = create<NetworkState>((set, get) => ({
  nodes: [],
  connections: [],
  stats: {
    activeNodes: 0,
    totalUsers: 0,
    totalCountries: 0,
    totalBandwidth: 0,
  },
  selectedNode: null,
  hoveredNode: null,

  fetchNetworkData: async () => {
    // In a real app, this would fetch data from an API
    // For now, we'll generate mock data
    const { nodes, connections, stats } = generateMockNetworkData()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    set({ nodes, connections, stats })
  },

  selectNode: (nodeId: string | null) => {
    const { nodes } = get()
    const selectedNode = nodeId ? nodes.find((node) => node.id === nodeId) || null : null
    set({ selectedNode })
  },

  hoverNode: (nodeId: string | null) => {
    const { nodes } = get()
    const hoveredNode = nodeId ? nodes.find((node) => node.id === nodeId) || null : null
    set({ hoveredNode })
  },
}))
