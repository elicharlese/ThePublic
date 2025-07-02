# Solana Integration Guide

This document covers the Solana blockchain integration for ThePublic network.

## Overview

ThePublic uses Solana blockchain for:
- Node registration and identity management
- Reward distribution to node operators
- Micropayment channels for user payments
- Proof of coverage consensus mechanism

## Smart Contract Architecture

### Programs

1. **Node Registry Program**
   - Node registration and deregistration
   - Identity verification and Sybil resistance
   - Hardware attestation

2. **Rewards Program**
   - Reward calculation algorithms
   - Distribution mechanisms
   - Staking and slashing conditions

3. **Payment Program**
   - Micropayment channels
   - User payment processing
   - Fee distribution

4. **Governance Program**
   - Network parameter updates
   - Community voting
   - Proposal management

## Development Setup

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
npm install -g @coral-xyz/anchor-cli
```

### Project Structure

```
backend/solana/
├── programs/
│   ├── node-registry/
│   ├── rewards/
│   ├── payments/
│   └── governance/
├── tests/
├── migrations/
└── scripts/
```

### Environment Setup

```bash
# Set Solana cluster
solana config set --url devnet

# Create keypair for development
solana-keygen new --outfile ~/.config/solana/id.json

# Get test SOL
solana airdrop 2
```

## Node Registry Program

### State Accounts

```rust
#[account]
pub struct NodeAccount {
    pub owner: Pubkey,
    pub node_id: [u8; 32],
    pub location: Location,
    pub hardware_hash: [u8; 32],
    pub status: NodeStatus,
    pub registration_time: i64,
    pub last_heartbeat: i64,
    pub reputation_score: u64,
    pub total_rewards: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Location {
    pub latitude: f64,
    pub longitude: f64,
    pub country_code: [u8; 2],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum NodeStatus {
    Active,
    Inactive,
    Maintenance,
    Suspended,
}
```

### Instructions

```rust
// Register new node
pub fn register_node(
    ctx: Context<RegisterNode>,
    node_id: [u8; 32],
    location: Location,
    hardware_hash: [u8; 32],
) -> Result<()>

// Update node status
pub fn update_node_status(
    ctx: Context<UpdateNodeStatus>,
    status: NodeStatus,
) -> Result<()>

// Submit heartbeat
pub fn submit_heartbeat(
    ctx: Context<SubmitHeartbeat>,
    performance_metrics: PerformanceMetrics,
) -> Result<()>
```

## Rewards Program

### Reward Calculation

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RewardMetrics {
    pub uptime_percentage: u8,
    pub data_transferred: u64,
    pub users_served: u32,
    pub coverage_bonus: bool,
    pub reliability_score: u8,
}

pub fn calculate_rewards(metrics: &RewardMetrics) -> u64 {
    let base_reward = 100; // Base tokens per period
    let uptime_multiplier = metrics.uptime_percentage as u64;
    let traffic_bonus = metrics.data_transferred / 1_000_000; // 1 token per MB
    let user_bonus = metrics.users_served as u64 * 10;
    let coverage_bonus = if metrics.coverage_bonus { 50 } else { 0 };
    
    base_reward * uptime_multiplier / 100 + traffic_bonus + user_bonus + coverage_bonus
}
```

### Distribution

```rust
pub fn distribute_rewards(
    ctx: Context<DistributeRewards>,
    node_accounts: Vec<Pubkey>,
    reward_amounts: Vec<u64>,
) -> Result<()> {
    for (node_account, amount) in node_accounts.iter().zip(reward_amounts.iter()) {
        // Transfer tokens to node operator
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.reward_vault.to_account_info(),
                    to: ctx.accounts.node_token_account.to_account_info(),
                    authority: ctx.accounts.reward_authority.to_account_info(),
                },
            ),
            *amount,
        )?;
    }
    Ok(())
}
```

## Payment Program

### State Channels

```rust
#[account]
pub struct PaymentChannel {
    pub user: Pubkey,
    pub node: Pubkey,
    pub balance: u64,
    pub nonce: u64,
    pub timeout: i64,
    pub status: ChannelStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ChannelStatus {
    Open,
    Disputed,
    Closed,
}
```

### Channel Operations

```rust
// Open payment channel
pub fn open_channel(
    ctx: Context<OpenChannel>,
    initial_balance: u64,
    timeout: i64,
) -> Result<()>

// Update channel state
pub fn update_channel(
    ctx: Context<UpdateChannel>,
    new_balance: u64,
    nonce: u64,
    signature: [u8; 64],
) -> Result<()>

// Close channel
pub fn close_channel(
    ctx: Context<CloseChannel>,
    final_balance: u64,
    nonce: u64,
) -> Result<()>
```

## API Integration

### Connection Service

```typescript
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';

export class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private nodeProgram: Program;
  private rewardsProgram: Program;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!);
    // Initialize provider and programs
  }

  async registerNode(
    nodeId: Buffer,
    location: { lat: number; lng: number },
    hardwareHash: Buffer
  ): Promise<string> {
    // Implementation
  }

  async getNodeInfo(nodeAddress: PublicKey): Promise<NodeInfo> {
    // Implementation
  }

  async distributeRewards(
    nodes: PublicKey[],
    amounts: number[]
  ): Promise<string> {
    // Implementation
  }
}
```

### Frontend Integration

```typescript
// In your React components
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export function NodeRegistration() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const registerNode = async () => {
    if (!publicKey) return;

    try {
      const transaction = await createNodeRegistrationTransaction(
        connection,
        publicKey,
        nodeData
      );

      const signedTransaction = await signTransaction!(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      await connection.confirmTransaction(signature);
      console.log('Node registered:', signature);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <button onClick={registerNode}>
      Register Node
    </button>
  );
}
```

## Testing

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use anchor_lang::prelude::*;

    #[test]
    fn test_node_registration() {
        // Test node registration logic
    }

    #[test]
    fn test_reward_calculation() {
        let metrics = RewardMetrics {
            uptime_percentage: 98,
            data_transferred: 1_000_000_000,
            users_served: 50,
            coverage_bonus: true,
            reliability_score: 95,
        };

        let reward = calculate_rewards(&metrics);
        assert_eq!(reward, 1648); // Expected reward amount
    }
}
```

### Integration Tests

```typescript
import { anchor } from '@coral-xyz/anchor';

describe('Node Registry', () => {
  it('should register a new node', async () => {
    // Test implementation
  });

  it('should calculate rewards correctly', async () => {
    // Test implementation
  });
});
```

## Deployment

### Devnet Deployment

```bash
# Build programs
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Verify deployment
anchor test --provider.cluster devnet
```

### Mainnet Deployment

```bash
# Set cluster to mainnet
solana config set --url mainnet-beta

# Deploy with production keypair
anchor deploy --provider.cluster mainnet-beta --provider.wallet ~/.config/solana/mainnet-key.json

# Update program IDs in frontend
```

## Security Considerations

### Program Security

1. **Access Control**: Verify ownership before state modifications
2. **Integer Overflow**: Use checked arithmetic operations
3. **Account Validation**: Validate all account inputs
4. **Reentrancy**: Prevent recursive calls

### Best Practices

```rust
// Always check account ownership
require!(
    ctx.accounts.node_account.owner == ctx.accounts.signer.key(),
    ErrorCode::Unauthorized
);

// Use checked arithmetic
let new_balance = old_balance
    .checked_add(amount)
    .ok_or(ErrorCode::MathOverflow)?;

// Validate account types
require!(
    ctx.accounts.token_account.mint == ctx.accounts.token_mint.key(),
    ErrorCode::InvalidTokenAccount
);
```

## Monitoring and Analytics

### On-chain Analytics

Track key metrics:
- Number of registered nodes
- Total rewards distributed
- Average transaction fees
- Network uptime statistics

### Performance Monitoring

```typescript
// Monitor transaction confirmation times
const startTime = Date.now();
const signature = await connection.sendTransaction(transaction);
await connection.confirmTransaction(signature);
const confirmationTime = Date.now() - startTime;

logger.info('Transaction confirmed', {
  signature,
  confirmationTime,
  slot: await connection.getSlot(),
});
```

## Troubleshooting

### Common Issues

1. **Transaction Failures**
   - Check account balances
   - Verify program addresses
   - Review instruction data

2. **RPC Errors**
   - Switch to different RPC endpoint
   - Implement retry logic
   - Handle rate limiting

3. **Program Deployment Issues**
   - Ensure sufficient SOL for deployment
   - Check program size limits
   - Verify keypair permissions
