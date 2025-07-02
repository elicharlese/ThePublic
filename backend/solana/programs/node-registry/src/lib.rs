use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111112"); // Placeholder - replace with actual program ID

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;

#[program]
pub mod thepublic_node_registry {
    use super::*;

    /// Register a new node on the network
    pub fn register_node(
        ctx: Context<RegisterNode>,
        node_id: [u8; 32],
        location: Location,
        hardware_hash: [u8; 32],
    ) -> Result<()> {
        instructions::register_node(ctx, node_id, location, hardware_hash)
    }

    /// Update node status
    pub fn update_node_status(
        ctx: Context<UpdateNodeStatus>,
        status: NodeStatus,
    ) -> Result<()> {
        instructions::update_node_status(ctx, status)
    }

    /// Submit node heartbeat with performance metrics
    pub fn submit_heartbeat(
        ctx: Context<SubmitHeartbeat>,
        performance_metrics: PerformanceMetrics,
    ) -> Result<()> {
        instructions::submit_heartbeat(ctx, performance_metrics)
    }

    /// Deregister a node from the network
    pub fn deregister_node(ctx: Context<DeregisterNode>) -> Result<()> {
        instructions::deregister_node(ctx)
    }
}
