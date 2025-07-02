# Frontend Integration Guide

This document provides everything needed to integrate the backend API with the React/Next.js frontend.

## API Client Setup

### Base API Client

```typescript
// lib/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Redirect to login or refresh token
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth-token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth-token');
  }

  loadToken(): void {
    const token = localStorage.getItem('auth-token');
    if (token) {
      this.token = token;
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
```

### Authentication Service

```typescript
// services/auth.ts
import { apiClient } from '@/lib/api-client';
import { User, AuthResponse } from '@/types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface WalletLoginCredentials {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface RegisterData {
  email?: string;
  password?: string;
  walletAddress?: string;
  role?: 'user' | 'node_operator';
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  async walletLogin(credentials: WalletLoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/wallet-login', credentials);
    
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('/auth/profile');
    return response.data;
  }

  async updateProfile(profile: Partial<User>): Promise<User> {
    const response = await apiClient.put<{ data: User }>('/auth/profile', { profile });
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearToken();
  }
}

export const authService = new AuthService();
```

### Node Service

```typescript
// services/nodes.ts
import { apiClient } from '@/lib/api-client';
import { Node, CreateNodeRequest, UpdateNodeRequest } from '@/types/api';

class NodeService {
  async getAllNodes(params?: {
    status?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ nodes: Node[]; pagination: any }> {
    const response = await apiClient.get<{ data: any }>('/nodes', { params });
    return response.data;
  }

  async getNodeById(id: string): Promise<Node> {
    const response = await apiClient.get<{ data: Node }>(`/nodes/${id}`);
    return response.data;
  }

  async createNode(nodeData: CreateNodeRequest): Promise<{ node: Node; transactionSignature: string }> {
    const response = await apiClient.post<{ data: any }>('/nodes', nodeData);
    return response.data;
  }

  async updateNode(id: string, updateData: UpdateNodeRequest): Promise<{ node: Node; transactionSignature?: string }> {
    const response = await apiClient.put<{ data: any }>(`/nodes/${id}`, updateData);
    return response.data;
  }

  async deleteNode(id: string): Promise<{ message: string; transactionSignature: string }> {
    const response = await apiClient.delete<{ data: any }>(`/nodes/${id}`);
    return response.data;
  }

  async submitHeartbeat(id: string, metrics: any): Promise<{ node: Node; transactionSignature: string }> {
    const response = await apiClient.post<{ data: any }>(`/nodes/${id}/heartbeat`, {
      performance_metrics: metrics,
    });
    return response.data;
  }

  async getNodeRewards(id: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ rewards: any[]; pagination: any }> {
    const response = await apiClient.get<{ data: any }>(`/nodes/${id}/rewards`, { params });
    return response.data;
  }
}

export const nodeService = new NodeService();
```

### Network Service

```typescript
// services/network.ts
import { apiClient } from '@/lib/api-client';

class NetworkService {
  async getNetworkStats(): Promise<any> {
    const response = await apiClient.get<{ data: any }>('/network/stats');
    return response.data;
  }

  async getNetworkMap(params?: {
    bounds?: string;
    status?: string;
  }): Promise<{ nodes: any[]; connections: any[]; stats: any }> {
    const response = await apiClient.get<{ data: any }>('/network/map', { params });
    return response.data;
  }

  async getNetworkActivity(params?: {
    timeframe?: string;
  }): Promise<any> {
    const response = await apiClient.get<{ data: any }>('/network/activity', { params });
    return response.data;
  }

  async getNodeConnections(nodeId: string): Promise<any> {
    const response = await apiClient.get<{ data: any }>(`/network/nodes/${nodeId}/connections`);
    return response.data;
  }
}

export const networkService = new NetworkService();
```

## React Hooks

### Authentication Hook

```typescript
// hooks/useAuth.ts
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { authService } from '@/services/auth';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  walletLogin: (walletAddress: string, signature: string, message: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      apiClient.loadToken();
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.data.user);
  };

  const walletLogin = async (walletAddress: string, signature: string, message: string) => {
    const response = await authService.walletLogin({ walletAddress, signature, message });
    setUser(response.data.user);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    setUser(response.data.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (profile: Partial<User>) => {
    const updatedUser = await authService.updateProfile(profile);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      walletLogin,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Network Data Hook

```typescript
// hooks/useNetworkData.ts
import { useState, useEffect } from 'react';
import { networkService } from '@/services/network';

export function useNetworkStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await networkService.getNetworkStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchStats };
}

export function useNetworkMap(bounds?: string) {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMapData();
  }, [bounds]);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const data = await networkService.getNetworkMap({ bounds });
      setMapData(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { mapData, loading, error, refetch: fetchMapData };
}
```

## Real-time Updates

### WebSocket Hook

```typescript
// hooks/useRealtimeUpdates.ts
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeUpdates() {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('general-updates')
      .on('broadcast', { event: 'network_update' }, (payload) => {
        setUpdates(prev => [payload.payload, ...prev.slice(0, 99)]); // Keep last 100 updates
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return updates;
}

export function useNodeUpdates(nodeId?: string) {
  const [nodeData, setNodeData] = useState(null);

  useEffect(() => {
    if (!nodeId) return;

    const channel = supabase
      .channel('node-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nodes',
          filter: `node_id=eq.${nodeId}`,
        },
        (payload) => {
          setNodeData(payload.new || payload.old);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nodeId]);

  return nodeData;
}
```

## Error Handling

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send error to monitoring service
    // Example: Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## State Management with Zustand

```typescript
// store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Network state
  networkStats: any;
  setNetworkStats: (stats: any) => void;
  
  // Node state
  userNodes: any[];
  setUserNodes: (nodes: any[]) => void;
  
  // Notifications
  notifications: any[];
  addNotification: (notification: any) => void;
  markNotificationRead: (id: string) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Network state
      networkStats: null,
      setNetworkStats: (stats) => set({ networkStats: stats }),
      
      // Node state
      userNodes: [],
      setUserNodes: (nodes) => set({ userNodes: nodes }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => 
        set(state => ({ 
          notifications: [notification, ...state.notifications] 
        })),
      markNotificationRead: (id) =>
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        })),
      
      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'thepublic-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
```

## Example Components

### Network Stats Dashboard

```typescript
// components/NetworkStats.tsx
import { useNetworkStats } from '@/hooks/useNetworkData';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';

export function NetworkStats() {
  const { stats, loading, error } = useNetworkStats();
  const updates = useRealtimeUpdates();

  if (loading) return <div>Loading network stats...</div>;
  if (error) return <div>Error loading stats: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Total Nodes"
        value={stats?.totalNodes || 0}
        icon="🌐"
        trend="+5.2%"
      />
      <StatCard
        title="Active Nodes"
        value={stats?.activeNodes || 0}
        icon="🟢"
        trend="+2.1%"
      />
      <StatCard
        title="Total Users"
        value={stats?.totalUsers || 0}
        icon="👥"
        trend="+8.7%"
      />
      <StatCard
        title="Data Transferred"
        value={formatBytes(stats?.dataTransferred || 0)}
        icon="📊"
        trend="+12.3%"
      />
    </div>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      <p className="text-sm text-green-600 mt-2">{trend}</p>
    </div>
  );
}
```

This integration guide provides everything needed to connect the frontend with the backend API, including authentication, real-time updates, state management, and error handling.
