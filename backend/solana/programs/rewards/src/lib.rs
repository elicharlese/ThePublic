use anchor_lang::prelude::*;

declare_id!("22222222222222222222222222222223"); // Placeholder - replace with actual program ID

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;

#[program]
pub mod thepublic_rewards {
    use super::*;

    /// Initialize the rewards program
    pub fn initialize_rewards(
        ctx: Context<InitializeRewards>,
        reward_params: RewardParams,
    ) -> Result<()> {
        instructions::initialize_rewards(ctx, reward_params)
    }

    /// Calculate and distribute rewards for a period
    pub fn distribute_rewards(
        ctx: Context<DistributeRewards>,
        node_accounts: Vec<Pubkey>,
        reward_amounts: Vec<u64>,
    ) -> Result<()> {
        instructions::distribute_rewards(ctx, node_accounts, reward_amounts)
    }

    /// Claim rewards for a specific node
    pub fn claim_rewards(
        ctx: Context<ClaimRewards>,
        amount: u64,
    ) -> Result<()> {
        instructions::claim_rewards(ctx, amount)
    }

    /// Update reward parameters (admin only)
    pub fn update_reward_params(
        ctx: Context<UpdateRewardParams>,
        new_params: RewardParams,
    ) -> Result<()> {
        instructions::update_reward_params(ctx, new_params)
    }
}
