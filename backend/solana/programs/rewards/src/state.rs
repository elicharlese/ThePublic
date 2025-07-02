use anchor_lang::prelude::*;

#[account]
pub struct RewardsState {
    /// Authority that can update reward parameters
    pub authority: Pubkey,
    /// Reward token mint
    pub reward_mint: Pubkey,
    /// Vault holding reward tokens
    pub reward_vault: Pubkey,
    /// Current reward parameters
    pub reward_params: RewardParams,
    /// Total rewards distributed
    pub total_distributed: u64,
    /// Current reward period
    pub current_period: u64,
}

impl RewardsState {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // reward_mint
        32 + // reward_vault
        RewardParams::LEN +
        8 + // total_distributed
        8; // current_period
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct RewardParams {
    /// Base reward per period (in tokens)
    pub base_reward: u64,
    /// Multiplier for uptime bonus (basis points)
    pub uptime_multiplier: u16,
    /// Reward per GB of data transferred
    pub data_reward_rate: u64,
    /// Reward per user served
    pub user_reward_rate: u64,
    /// Minimum uptime for rewards (percentage)
    pub min_uptime: u8,
    /// Reward period duration (seconds)
    pub period_duration: u64,
}

impl RewardParams {
    pub const LEN: usize = 8 + 2 + 8 + 8 + 1 + 8;
}

#[account]
pub struct NodeRewardAccount {
    /// Node account this reward account belongs to
    pub node_account: Pubkey,
    /// Owner of the node
    pub owner: Pubkey,
    /// Total rewards earned
    pub total_earned: u64,
    /// Total rewards claimed
    pub total_claimed: u64,
    /// Last reward calculation period
    pub last_calculated_period: u64,
    /// Pending rewards
    pub pending_rewards: u64,
}

impl NodeRewardAccount {
    pub const LEN: usize = 8 + // discriminator
        32 + // node_account
        32 + // owner
        8 + // total_earned
        8 + // total_claimed
        8 + // last_calculated_period
        8; // pending_rewards
}

#[account]
pub struct RewardDistribution {
    /// Period this distribution is for
    pub period: u64,
    /// Total nodes in this distribution
    pub total_nodes: u32,
    /// Total amount distributed
    pub total_amount: u64,
    /// Distribution timestamp
    pub distributed_at: i64,
    /// Merkle root for verification (if using merkle distribution)
    pub merkle_root: [u8; 32],
}

impl RewardDistribution {
    pub const LEN: usize = 8 + // discriminator
        8 + // period
        4 + // total_nodes
        8 + // total_amount
        8 + // distributed_at
        32; // merkle_root
}
