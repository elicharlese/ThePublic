# Supabase Integration Guide

This document covers the Supabase database and authentication integration for ThePublic.

## Overview

Supabase provides:
- PostgreSQL database with real-time subscriptions
- Authentication and user management
- Row Level Security (RLS)
- API generation and management

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  wallet_address TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'node_operator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile JSONB DEFAULT '{}'::jsonb
);
```

#### Nodes Table
```sql
CREATE TABLE nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  node_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'maintenance', 'suspended')),
  location JSONB NOT NULL, -- {lat, lng, city, country}
  hardware JSONB NOT NULL, -- {type, specs, capabilities}
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_heartbeat TIMESTAMP WITH TIME ZONE
);
```

#### Rewards Table
```sql
CREATE TABLE rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(20, 8) NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('coverage', 'traffic', 'reliability', 'bonus')),
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  transaction_signature TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'distributed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Network Stats Table
```sql
CREATE TABLE network_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_nodes INTEGER NOT NULL,
  active_nodes INTEGER NOT NULL,
  total_users INTEGER NOT NULL,
  data_transferred BIGINT NOT NULL, -- in bytes
  uptime_percentage DECIMAL(5, 2) NOT NULL,
  avg_response_time DECIMAL(10, 2), -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  cover_image TEXT,
  read_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);
```

### Indexes and Performance

```sql
-- Indexes for better query performance
CREATE INDEX idx_nodes_owner_id ON nodes(owner_id);
CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_nodes_location ON nodes USING gin(location);
CREATE INDEX idx_rewards_node_id ON rewards(node_id);
CREATE INDEX idx_rewards_owner_id ON rewards(owner_id);
CREATE INDEX idx_rewards_period ON rewards(period_start, period_end);
CREATE INDEX idx_network_stats_timestamp ON network_stats(timestamp);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
```

## Row Level Security (RLS)

### Users Table Policies
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Nodes Table Policies
```sql
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;

-- Anyone can read active nodes
CREATE POLICY "Anyone can read active nodes" ON nodes
  FOR SELECT USING (status = 'active');

-- Node owners can manage their nodes
CREATE POLICY "Owners can manage nodes" ON nodes
  FOR ALL USING (owner_id = auth.uid());

-- Admins can manage all nodes
CREATE POLICY "Admins can manage all nodes" ON nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Rewards Table Policies
```sql
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Users can read their own rewards
CREATE POLICY "Users can read own rewards" ON rewards
  FOR SELECT USING (owner_id = auth.uid());

-- Admins can read all rewards
CREATE POLICY "Admins can read all rewards" ON rewards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Real-time Subscriptions

### Node Status Updates
```typescript
// Subscribe to node status changes
const subscription = supabase
  .channel('node-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'nodes',
      filter: 'status=neq.inactive',
    },
    (payload) => {
      console.log('Node status changed:', payload);
      // Update UI state
    }
  )
  .subscribe();
```

### Network Statistics
```typescript
// Subscribe to network stats updates
const statsSubscription = supabase
  .channel('network-stats')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'network_stats',
    },
    (payload) => {
      console.log('New network stats:', payload.new);
      // Update dashboard
    }
  )
  .subscribe();
```

## Backend Integration

### Service Layer
```typescript
import { createClient } from '@supabase/supabase-js';

export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // User management
  async createUser(userData: CreateUserData): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Node management
  async registerNode(nodeData: CreateNodeData): Promise<Node> {
    const { data, error } = await this.supabase
      .from('nodes')
      .insert([nodeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateNodeStatus(nodeId: string, status: NodeStatus): Promise<void> {
    const { error } = await this.supabase
      .from('nodes')
      .update({ 
        status, 
        updated_at: new Date().toISOString(),
        last_heartbeat: new Date().toISOString()
      })
      .eq('id', nodeId);

    if (error) throw error;
  }

  async getActiveNodes(): Promise<Node[]> {
    const { data, error } = await this.supabase
      .from('nodes')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Rewards management
  async createReward(rewardData: CreateRewardData): Promise<Reward> {
    const { data, error } = await this.supabase
      .from('rewards')
      .insert([rewardData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserRewards(userId: string): Promise<Reward[]> {
    const { data, error } = await this.supabase
      .from('rewards')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Network statistics
  async getNetworkStats(): Promise<NetworkStats | null> {
    const { data, error } = await this.supabase
      .from('network_stats')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  }

  async updateNetworkStats(stats: NetworkStatsUpdate): Promise<void> {
    const { error } = await this.supabase
      .from('network_stats')
      .insert([{
        ...stats,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  }
}
```

## Authentication Integration

### JWT Token Verification
```typescript
import { verify } from 'jsonwebtoken';

export const verifySupabaseToken = async (token: string): Promise<User | null> => {
  try {
    // Verify JWT token with Supabase secret
    const decoded = verify(token, process.env.SUPABASE_JWT_SECRET!) as any;
    
    // Get user from database
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.sub)
      .single();

    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
```

### Wallet Authentication
```typescript
export const authenticateWallet = async (
  walletAddress: string,
  signature: string,
  message: string
): Promise<User | null> => {
  // Verify signature (implementation depends on wallet type)
  const isValidSignature = await verifyWalletSignature(
    walletAddress,
    signature,
    message
  );

  if (!isValidSignature) {
    throw new Error('Invalid wallet signature');
  }

  // Find or create user with wallet address
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (!user) {
    // Create new user with wallet address
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        wallet_address: walletAddress,
        role: 'user'
      }])
      .select()
      .single();

    if (error) throw error;
    user = newUser;
  }

  return user;
};
```

## Database Functions

### Performance Metrics Aggregation
```sql
CREATE OR REPLACE FUNCTION calculate_node_performance(
  node_uuid UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH performance_data AS (
    SELECT 
      COUNT(*) as total_periods,
      AVG((performance_metrics->>'uptime_percentage')::numeric) as avg_uptime,
      SUM((performance_metrics->>'data_transferred')::bigint) as total_data,
      AVG((performance_metrics->>'response_time')::numeric) as avg_response_time
    FROM nodes 
    WHERE id = node_uuid
      AND updated_at BETWEEN start_date AND end_date
  )
  SELECT jsonb_build_object(
    'avg_uptime', COALESCE(avg_uptime, 0),
    'total_data_gb', COALESCE(total_data / 1073741824, 0),
    'avg_response_time_ms', COALESCE(avg_response_time, 0),
    'total_periods', COALESCE(total_periods, 0)
  ) INTO result
  FROM performance_data;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### Reward Calculation Function
```sql
CREATE OR REPLACE FUNCTION calculate_node_rewards(
  node_uuid UUID,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE
)
RETURNS DECIMAL(20, 8) AS $$
DECLARE
  base_reward DECIMAL(20, 8) := 100;
  performance JSONB;
  total_reward DECIMAL(20, 8) := 0;
BEGIN
  -- Get node performance for the period
  SELECT calculate_node_performance(node_uuid, period_start, period_end) INTO performance;
  
  -- Calculate rewards based on performance
  total_reward := base_reward * (performance->>'avg_uptime')::numeric / 100;
  
  -- Add data transfer bonus (1 token per GB)
  total_reward := total_reward + (performance->>'total_data_gb')::numeric;
  
  -- Add reliability bonus for >95% uptime
  IF (performance->>'avg_uptime')::numeric > 95 THEN
    total_reward := total_reward + 50;
  END IF;
  
  RETURN total_reward;
END;
$$ LANGUAGE plpgsql;
```

## Triggers and Automation

### Auto-update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nodes_updated_at 
  BEFORE UPDATE ON nodes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### Auto-publish Blog Posts
```sql
CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published_at <= NOW() AND OLD.published = false THEN
    NEW.published = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_publish_posts
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_publish_scheduled_posts();
```

## Backup and Recovery

### Automated Backups
Supabase provides automated backups, but you can also create custom backup strategies:

```sql
-- Create backup table
CREATE TABLE nodes_backup AS TABLE nodes;

-- Scheduled backup function
CREATE OR REPLACE FUNCTION create_daily_backup()
RETURNS void AS $$
BEGIN
  -- Backup critical tables
  DROP TABLE IF EXISTS nodes_backup;
  CREATE TABLE nodes_backup AS TABLE nodes;
  
  DROP TABLE IF EXISTS users_backup;
  CREATE TABLE users_backup AS TABLE users;
  
  DROP TABLE IF EXISTS rewards_backup;
  CREATE TABLE rewards_backup AS TABLE rewards;
END;
$$ LANGUAGE plpgsql;
```

## Monitoring and Analytics

### Performance Views
```sql
CREATE VIEW node_performance_summary AS
SELECT 
  n.id,
  n.name,
  n.status,
  n.location->>'city' as city,
  n.location->>'country' as country,
  COUNT(r.id) as total_rewards,
  SUM(r.amount) as total_earned,
  n.performance_metrics->>'avg_uptime' as uptime_percentage
FROM nodes n
LEFT JOIN rewards r ON n.id = r.node_id
WHERE n.status = 'active'
GROUP BY n.id, n.name, n.status, n.location, n.performance_metrics;
```

### Analytics Functions
```typescript
export class AnalyticsService {
  async getNetworkGrowth(days: number = 30): Promise<GrowthData[]> {
    const { data, error } = await supabase
      .from('network_stats')
      .select('timestamp, total_nodes, total_users')
      .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp');

    if (error) throw error;
    return data || [];
  }

  async getTopPerformingNodes(limit: number = 10): Promise<Node[]> {
    const { data, error } = await supabase
      .from('node_performance_summary')
      .select('*')
      .order('total_earned', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}
```

## Best Practices

1. **Use Transactions**: For operations that modify multiple tables
2. **Implement Proper Indexes**: For frequently queried columns
3. **Use Row Level Security**: Always enable RLS for data protection
4. **Monitor Performance**: Use Supabase analytics and custom metrics
5. **Regular Backups**: Implement both automated and manual backup strategies
6. **Connection Pooling**: Use connection pooling for high-traffic applications
