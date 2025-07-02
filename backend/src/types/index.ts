// Database types based on Supabase schema

export interface User {
  id: string;
  email?: string;
  wallet_address?: string;
  role: 'user' | 'node_operator' | 'admin';
  created_at: string;
  updated_at: string;
  profile: Record<string, any>;
}

export interface Node {
  id: string;
  owner_id: string;
  node_id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'suspended';
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  hardware: {
    type: string;
    specs: string;
    capabilities?: string[];
  };
  performance_metrics: PerformanceMetrics;
  created_at: string;
  updated_at: string;
  last_heartbeat?: string;
}

export interface PerformanceMetrics {
  uptime_percentage?: number;
  data_transferred?: number;
  users_served?: number;
  response_time?: number;
  reliability_score?: number;
}

export interface Reward {
  id: string;
  node_id: string;
  owner_id: string;
  amount: number;
  reward_type: 'coverage' | 'traffic' | 'reliability' | 'bonus';
  period_start: string;
  period_end: string;
  transaction_signature?: string;
  status: 'pending' | 'distributed' | 'failed';
  created_at: string;
}

export interface NetworkStats {
  id: string;
  timestamp: string;
  total_nodes: number;
  active_nodes: number;
  total_users: number;
  data_transferred: number;
  uptime_percentage: number;
  avg_response_time?: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  author_id?: string;
  category: string;
  tags?: string[];
  published: boolean;
  featured: boolean;
  cover_image?: string;
  read_time?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'send' | 'receive' | 'reward';
  amount: number;
  from_address?: string;
  to_address?: string;
  signature: string;
  status: 'pending' | 'confirmed' | 'failed';
  block_hash?: string;
  block_number?: number;
  gas_used?: number;
  fee?: number;
  created_at: string;
  confirmed_at?: string;
}

// API Request/Response types
export interface CreateUserRequest {
  email?: string;
  password?: string;
  wallet_address?: string;
  role?: 'user' | 'node_operator';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface WalletLoginRequest {
  wallet_address: string;
  signature: string;
  message: string;
}

export interface CreateNodeRequest {
  name: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  hardware: {
    type: string;
    specs: string;
    capabilities?: string[];
  };
}

export interface UpdateNodeRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  performance_metrics?: PerformanceMetrics;
}

export interface SendTransactionRequest {
  recipient: string;
  amount: number;
  memo?: string;
}

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  description?: string;
  content: string;
  category: string;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
  cover_image?: string;
  published_at?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Solana types
export interface SolanaNodeAccount {
  owner: string;
  nodeId: number[];
  location: {
    latitude: number;
    longitude: number;
    countryCode: number[];
  };
  hardwareHash: number[];
  status: { active: {} } | { inactive: {} } | { maintenance: {} } | { suspended: {} };
  registrationTime: number;
  lastHeartbeat: number;
  reputationScore: number;
  totalRewards: number;
  performanceMetrics: {
    uptimePercentage: number;
    dataTransferred: number;
    usersServed: number;
    avgResponseTime: number;
    reliabilityScore: number;
  };
}

export interface SolanaNetworkState {
  authority: string;
  totalNodes: number;
  activeNodes: number;
  minReputation: number;
  rewardParams: {
    baseReward: number;
    uptimeMultiplier: number;
    dataRewardRate: number;
    userRewardRate: number;
  };
}

// Utility types
export type NodeStatus = Node['status'];
export type UserRole = User['role'];
export type RewardType = Reward['reward_type'];
export type TransactionType = Transaction['type'];
export type TransactionStatus = Transaction['status'];
