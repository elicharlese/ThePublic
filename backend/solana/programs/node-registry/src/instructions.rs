use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(node_id: [u8; 32])]
pub struct RegisterNode<'info> {
    #[account(
        init,
        payer = owner,
        space = NodeAccount::LEN,
        seeds = [b"node", node_id.as_ref()],
        bump
    )]
    pub node_account: Account<'info, NodeAccount>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"network_state"],
        bump
    )]
    pub network_state: Account<'info, NetworkState>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateNodeStatus<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"node", node_account.node_id.as_ref()],
        bump
    )]
    pub node_account: Account<'info, NodeAccount>,
    
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"network_state"],
        bump
    )]
    pub network_state: Account<'info, NetworkState>,
}

#[derive(Accounts)]
pub struct SubmitHeartbeat<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"node", node_account.node_id.as_ref()],
        bump
    )]
    pub node_account: Account<'info, NodeAccount>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeregisterNode<'info> {
    #[account(
        mut,
        has_one = owner,
        seeds = [b"node", node_account.node_id.as_ref()],
        bump,
        close = owner
    )]
    pub node_account: Account<'info, NodeAccount>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"network_state"],
        bump
    )]
    pub network_state: Account<'info, NetworkState>,
}

pub fn register_node(
    ctx: Context<RegisterNode>,
    node_id: [u8; 32],
    location: Location,
    hardware_hash: [u8; 32],
) -> Result<()> {
    let node_account = &mut ctx.accounts.node_account;
    let network_state = &mut ctx.accounts.network_state;
    let clock = Clock::get()?;

    // Validate location
    require!(
        location.latitude >= -90.0 && location.latitude <= 90.0,
        NodeRegistryError::InvalidLocation
    );
    require!(
        location.longitude >= -180.0 && location.longitude <= 180.0,
        NodeRegistryError::InvalidLocation
    );

    // Initialize node account
    node_account.owner = ctx.accounts.owner.key();
    node_account.node_id = node_id;
    node_account.location = location;
    node_account.hardware_hash = hardware_hash;
    node_account.status = NodeStatus::Inactive;
    node_account.registration_time = clock.unix_timestamp;
    node_account.last_heartbeat = clock.unix_timestamp;
    node_account.reputation_score = 500; // Start with neutral reputation
    node_account.total_rewards = 0;
    node_account.performance_metrics = PerformanceMetrics::default();

    // Update network state
    network_state.total_nodes = network_state.total_nodes.checked_add(1)
        .ok_or(NodeRegistryError::MathOverflow)?;

    msg!("Node registered: {:?}", node_id);
    
    Ok(())
}

pub fn update_node_status(
    ctx: Context<UpdateNodeStatus>,
    status: NodeStatus,
) -> Result<()> {
    let node_account = &mut ctx.accounts.node_account;
    let network_state = &mut ctx.accounts.network_state;
    let old_status = node_account.status.clone();

    // Update status
    node_account.status = status.clone();

    // Update network active node count
    match (old_status, status) {
        (NodeStatus::Active, NodeStatus::Inactive | NodeStatus::Maintenance | NodeStatus::Suspended) => {
            network_state.active_nodes = network_state.active_nodes.saturating_sub(1);
        },
        (NodeStatus::Inactive | NodeStatus::Maintenance | NodeStatus::Suspended, NodeStatus::Active) => {
            network_state.active_nodes = network_state.active_nodes.checked_add(1)
                .ok_or(NodeRegistryError::MathOverflow)?;
        },
        _ => {} // No change in active count
    }

    msg!("Node status updated to: {:?}", status);
    
    Ok(())
}

pub fn submit_heartbeat(
    ctx: Context<SubmitHeartbeat>,
    performance_metrics: PerformanceMetrics,
) -> Result<()> {
    let node_account = &mut ctx.accounts.node_account;
    let clock = Clock::get()?;

    // Validate performance metrics
    require!(
        performance_metrics.uptime_percentage <= 100,
        NodeRegistryError::InvalidMetrics
    );
    require!(
        performance_metrics.reliability_score <= 100,
        NodeRegistryError::InvalidMetrics
    );

    // Update heartbeat and metrics
    node_account.last_heartbeat = clock.unix_timestamp;
    node_account.performance_metrics = performance_metrics;

    // Update reputation based on performance
    let new_reputation = calculate_reputation(&node_account.performance_metrics);
    node_account.reputation_score = new_reputation;

    msg!("Heartbeat submitted for node: {:?}", node_account.node_id);
    
    Ok(())
}

pub fn deregister_node(ctx: Context<DeregisterNode>) -> Result<()> {
    let node_account = &ctx.accounts.node_account;
    let network_state = &mut ctx.accounts.network_state;

    // Update network state
    network_state.total_nodes = network_state.total_nodes.saturating_sub(1);
    
    if node_account.status == NodeStatus::Active {
        network_state.active_nodes = network_state.active_nodes.saturating_sub(1);
    }

    msg!("Node deregistered: {:?}", node_account.node_id);
    
    Ok(())
}

fn calculate_reputation(metrics: &PerformanceMetrics) -> u16 {
    let uptime_score = (metrics.uptime_percentage as u16) * 5; // 0-500 points
    let reliability_score = (metrics.reliability_score as u16) * 5; // 0-500 points
    
    // Average the scores and ensure within bounds
    let reputation = (uptime_score + reliability_score) / 2;
    reputation.min(1000).max(0)
}
