-- Create database schema for ThePublic

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  wallet_address TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'node_operator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile JSONB DEFAULT '{}'::jsonb
);

-- Nodes table
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

-- Rewards table
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

-- Network stats table
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

-- Blog posts table
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

-- Transactions table for wallet operations
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('send', 'receive', 'reward')),
  amount DECIMAL(20, 8) NOT NULL,
  from_address TEXT,
  to_address TEXT,
  signature TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_hash TEXT,
  block_number BIGINT,
  gas_used BIGINT,
  fee DECIMAL(20, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Performance indexes
CREATE INDEX idx_nodes_owner_id ON nodes(owner_id);
CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_nodes_location ON nodes USING gin(location);
CREATE INDEX idx_rewards_node_id ON rewards(node_id);
CREATE INDEX idx_rewards_owner_id ON rewards(owner_id);
CREATE INDEX idx_rewards_period ON rewards(period_start, period_end);
CREATE INDEX idx_network_stats_timestamp ON network_stats(timestamp);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_signature ON transactions(signature);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Triggers for updated_at
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

CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON blog_posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
