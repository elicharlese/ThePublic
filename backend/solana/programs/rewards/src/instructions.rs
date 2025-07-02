use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct InitializeRewards<'info> {
    #[account(
        init,
        payer = authority,
        space = RewardsState::LEN,
        seeds = [b"rewards_state"],
        bump
    )]
    pub rewards_state: Account<'info, RewardsState>,
    
    pub reward_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = reward_mint,
        token::authority = rewards_state,
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(
        mut,
        seeds = [b"rewards_state"],
        bump,
        has_one = authority
    )]
    pub rewards_state: Account<'info, RewardsState>,
    
    #[account(
        mut,
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        space = RewardDistribution::LEN,
        seeds = [b"distribution", rewards_state.current_period.to_le_bytes().as_ref()],
        bump
    )]
    pub distribution: Account<'info, RewardDistribution>,
    
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        seeds = [b"rewards_state"],
        bump
    )]
    pub rewards_state: Account<'info, RewardsState>,
    
    #[account(
        mut,
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"node_rewards", node_reward_account.node_account.as_ref()],
        bump,
        has_one = owner
    )]
    pub node_reward_account: Account<'info, NodeRewardAccount>,
    
    #[account(
        mut,
        token::mint = rewards_state.reward_mint,
        token::authority = owner
    )]
    pub owner_token_account: Account<'info, TokenAccount>,
    
    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateRewardParams<'info> {
    #[account(
        mut,
        seeds = [b"rewards_state"],
        bump,
        has_one = authority
    )]
    pub rewards_state: Account<'info, RewardsState>,
    
    pub authority: Signer<'info>,
}

pub fn initialize_rewards(
    ctx: Context<InitializeRewards>,
    reward_params: RewardParams,
) -> Result<()> {
    let rewards_state = &mut ctx.accounts.rewards_state;
    
    rewards_state.authority = ctx.accounts.authority.key();
    rewards_state.reward_mint = ctx.accounts.reward_mint.key();
    rewards_state.reward_vault = ctx.accounts.reward_vault.key();
    rewards_state.reward_params = reward_params;
    rewards_state.total_distributed = 0;
    rewards_state.current_period = 0;
    
    msg!("Rewards program initialized");
    Ok(())
}

pub fn distribute_rewards(
    ctx: Context<DistributeRewards>,
    node_accounts: Vec<Pubkey>,
    reward_amounts: Vec<u64>,
) -> Result<()> {
    let rewards_state = &mut ctx.accounts.rewards_state;
    let distribution = &mut ctx.accounts.distribution;
    
    require!(
        node_accounts.len() == reward_amounts.len(),
        RewardsError::MismatchedArrayLengths
    );
    
    let total_amount: u64 = reward_amounts.iter().sum();
    
    require!(
        ctx.accounts.reward_vault.amount >= total_amount,
        RewardsError::InsufficientVaultBalance
    );
    
    // Initialize distribution record
    distribution.period = rewards_state.current_period;
    distribution.total_nodes = node_accounts.len() as u32;
    distribution.total_amount = total_amount;
    distribution.distributed_at = Clock::get()?.unix_timestamp;
    distribution.merkle_root = [0; 32]; // Placeholder for merkle root
    
    // Update rewards state
    rewards_state.total_distributed = rewards_state.total_distributed
        .checked_add(total_amount)
        .ok_or(RewardsError::MathOverflow)?;
    
    rewards_state.current_period = rewards_state.current_period
        .checked_add(1)
        .ok_or(RewardsError::MathOverflow)?;
    
    msg!("Distributed {} tokens to {} nodes for period {}", 
         total_amount, node_accounts.len(), distribution.period);
    
    Ok(())
}

pub fn claim_rewards(
    ctx: Context<ClaimRewards>,
    amount: u64,
) -> Result<()> {
    let node_reward_account = &mut ctx.accounts.node_reward_account;
    
    require!(
        node_reward_account.pending_rewards >= amount,
        RewardsError::InsufficientPendingRewards
    );
    
    // Transfer tokens from vault to owner
    let seeds = &[
        b"rewards_state",
        &[ctx.bumps.rewards_state]
    ];
    let signer_seeds = &[&seeds[..]];
    
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.reward_vault.to_account_info(),
                to: ctx.accounts.owner_token_account.to_account_info(),
                authority: ctx.accounts.rewards_state.to_account_info(),
            },
            signer_seeds
        ),
        amount,
    )?;
    
    // Update node reward account
    node_reward_account.pending_rewards = node_reward_account.pending_rewards
        .checked_sub(amount)
        .ok_or(RewardsError::MathOverflow)?;
    
    node_reward_account.total_claimed = node_reward_account.total_claimed
        .checked_add(amount)
        .ok_or(RewardsError::MathOverflow)?;
    
    msg!("Claimed {} tokens for node {}", amount, node_reward_account.node_account);
    
    Ok(())
}

pub fn update_reward_params(
    ctx: Context<UpdateRewardParams>,
    new_params: RewardParams,
) -> Result<()> {
    let rewards_state = &mut ctx.accounts.rewards_state;
    
    rewards_state.reward_params = new_params;
    
    msg!("Reward parameters updated");
    Ok(())
}
