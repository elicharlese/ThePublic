use anchor_lang::prelude::*;

#[account]
pub struct NodeAccount {
    /// The owner/operator of this node
    pub owner: Pubkey,
    /// Unique node identifier
    pub node_id: [u8; 32],
    /// Geographic location of the node
    pub location: Location,
    /// Hash of hardware specifications
    pub hardware_hash: [u8; 32],
    /// Current status of the node
    pub status: NodeStatus,
    /// When the node was registered
    pub registration_time: i64,
    /// Last heartbeat timestamp
    pub last_heartbeat: i64,
    /// Reputation score (0-1000)
    pub reputation_score: u16,
    /// Total rewards earned
    pub total_rewards: u64,
    /// Performance metrics
    pub performance_metrics: PerformanceMetrics,
}

impl NodeAccount {
    pub const LEN: usize = 8 + // discriminator
        32 + // owner
        32 + // node_id
        Location::LEN +
        32 + // hardware_hash
        NodeStatus::LEN +
        8 + // registration_time
        8 + // last_heartbeat
        2 + // reputation_score
        8 + // total_rewards
        PerformanceMetrics::LEN;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Location {
    /// Latitude in degrees (-90 to 90)
    pub latitude: f64,
    /// Longitude in degrees (-180 to 180)
    pub longitude: f64,
    /// Country code (ISO 3166-1 alpha-2)
    pub country_code: [u8; 2],
}

impl Location {
    pub const LEN: usize = 8 + 8 + 2; // latitude + longitude + country_code
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum NodeStatus {
    /// Node is active and serving users
    Active,
    /// Node is inactive
    Inactive,
    /// Node is in maintenance mode
    Maintenance,
    /// Node is suspended due to poor performance
    Suspended,
}

impl NodeStatus {
    pub const LEN: usize = 1 + 1; // enum discriminator + largest variant
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default)]
pub struct PerformanceMetrics {
    /// Uptime percentage (0-100)
    pub uptime_percentage: u8,
    /// Data transferred in bytes
    pub data_transferred: u64,
    /// Number of users served
    pub users_served: u32,
    /// Average response time in milliseconds
    pub avg_response_time: u32,
    /// Reliability score (0-100)
    pub reliability_score: u8,
}

impl PerformanceMetrics {
    pub const LEN: usize = 1 + 8 + 4 + 4 + 1;
}

#[account]
pub struct NetworkState {
    /// Authority that can update network parameters
    pub authority: Pubkey,
    /// Total number of registered nodes
    pub total_nodes: u32,
    /// Number of active nodes
    pub active_nodes: u32,
    /// Minimum reputation score required
    pub min_reputation: u16,
    /// Reward parameters
    pub reward_params: RewardParams,
}

impl NetworkState {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        4 + // total_nodes
        4 + // active_nodes
        2 + // min_reputation
        RewardParams::LEN;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct RewardParams {
    /// Base reward per period
    pub base_reward: u64,
    /// Multiplier for high uptime (basis points)
    pub uptime_multiplier: u16,
    /// Reward per GB of data transferred
    pub data_reward_rate: u64,
    /// Reward per user served
    pub user_reward_rate: u64,
}

impl RewardParams {
    pub const LEN: usize = 8 + 2 + 8 + 8;
}
