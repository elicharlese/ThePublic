# Supabase Integration Guide

This document covers the complete Supabase integration for ThePublic backend, including database schema, authentication, real-time features, and security policies.

## Overview

Supabase provides:
- PostgreSQL database with real-time subscriptions
- Built-in authentication with multiple providers
- Row Level Security (RLS) for data protection
- Edge functions for serverless compute
- Auto-generated APIs with TypeScript support

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
  status TEXT DEFAULT 'inactive',
  location JSONB NOT NULL,
  hardware JSONB NOT NULL,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_heartbeat TIMESTAMP WITH TIME ZONE
);
```

## Authentication

### Email Authentication
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
});
```

### Wallet-Based Authentication
```typescript
async function authenticateWallet(
  walletAddress: string,
  signature: string,
  message: string
): Promise<User> {
  // Verify Solana signature
  const isValid = verifySignature(message, signature, walletAddress);
  
  if (!isValid) {
    throw new Error('Invalid signature');
  }

  // Check if user exists or create new user
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  return user || createNewUser(walletAddress);
}
```

## Row Level Security (RLS)

### User Policies
```sql
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Node Policies
```sql
CREATE POLICY "Anyone can read active nodes" ON nodes
  FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can manage their nodes" ON nodes
  FOR ALL USING (owner_id = auth.uid());
```

## Real-time Subscriptions

```typescript
const subscription = supabase
  .channel('node-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'nodes',
  }, (payload) => {
    console.log('Node changed:', payload);
  })
  .subscribe();
```

For complete implementation details, see the migration files in `backend/supabase/migrations/`.
