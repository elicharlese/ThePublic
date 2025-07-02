use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use std::collections::HashMap;

declare_id!("MicropaymentChannels11111111111111111111");

#[program]
pub mod micropayment_channels {
    use super::*;

    /// Initialize the micropayment channel program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let channel_state = &mut ctx.accounts.channel_state;
        channel_state.authority = ctx.accounts.authority.key();
        channel_state.total_channels = 0;
        channel_state.total_volume = 0;
        Ok(())
    }

    /// Create a new payment channel between user and node operator
    pub fn create_channel(
        ctx: Context<CreateChannel>,
        channel_id: String,
        initial_deposit: u64,
        duration: i64,
    ) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let channel_state = &mut ctx.accounts.channel_state;
        let clock = Clock::get()?;

        require!(initial_deposit > 0, ChannelError::InvalidDeposit);
        require!(duration > 0, ChannelError::InvalidDuration);

        channel.channel_id = channel_id.clone();
        channel.user = ctx.accounts.user.key();
        channel.node_operator = ctx.accounts.node_operator.key();
        channel.initial_deposit = initial_deposit;
        channel.current_balance = initial_deposit;
        channel.total_spent = 0;
        channel.created_at = clock.unix_timestamp;
        channel.expires_at = clock.unix_timestamp + duration;
        channel.status = ChannelStatus::Active;
        channel.sequence_number = 0;
        channel.challenge_period = 3600; // 1 hour challenge period
        channel.last_update = clock.unix_timestamp;

        // Transfer initial deposit to escrow
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &channel.key(),
            initial_deposit,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.user.to_account_info(),
                channel.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        channel_state.total_channels += 1;

        emit!(ChannelCreated {
            channel_id,
            user: ctx.accounts.user.key(),
            node_operator: ctx.accounts.node_operator.key(),
            initial_deposit,
            expires_at: channel.expires_at,
        });

        Ok(())
    }

    /// Process a micropayment through the channel
    pub fn make_payment(
        ctx: Context<MakePayment>,
        amount: u64,
        service_data: ServiceData,
        signature: [u8; 64],
    ) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let clock = Clock::get()?;

        require!(channel.status == ChannelStatus::Active, ChannelError::ChannelNotActive);
        require!(clock.unix_timestamp < channel.expires_at, ChannelError::ChannelExpired);
        require!(amount > 0, ChannelError::InvalidAmount);
        require!(channel.current_balance >= amount, ChannelError::InsufficientBalance);

        // Verify the payment signature
        verify_payment_signature(
            &channel,
            amount,
            &service_data,
            &signature,
            &ctx.accounts.user.key(),
        )?;

        // Update channel state
        channel.current_balance -= amount;
        channel.total_spent += amount;
        channel.sequence_number += 1;
        channel.last_update = clock.unix_timestamp;

        // Record the payment
        let payment = &mut ctx.accounts.payment;
        payment.channel = channel.key();
        payment.amount = amount;
        payment.service_data = service_data.clone();
        payment.timestamp = clock.unix_timestamp;
        payment.sequence_number = channel.sequence_number;

        emit!(PaymentMade {
            channel_id: channel.channel_id.clone(),
            user: channel.user,
            node_operator: channel.node_operator,
            amount,
            service_data,
            sequence_number: channel.sequence_number,
        });

        Ok(())
    }

    /// Update channel state with signed commitment
    pub fn update_channel(
        ctx: Context<UpdateChannel>,
        new_balance: u64,
        sequence_number: u64,
        signature: [u8; 64],
    ) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let clock = Clock::get()?;

        require!(channel.status == ChannelStatus::Active, ChannelError::ChannelNotActive);
        require!(sequence_number > channel.sequence_number, ChannelError::InvalidSequence);
        require!(new_balance <= channel.initial_deposit, ChannelError::InvalidBalance);

        // Verify the update signature from both parties
        verify_update_signature(
            &channel,
            new_balance,
            sequence_number,
            &signature,
        )?;

        // Update channel state
        let spent_amount = channel.current_balance - new_balance;
        channel.current_balance = new_balance;
        channel.total_spent += spent_amount;
        channel.sequence_number = sequence_number;
        channel.last_update = clock.unix_timestamp;

        emit!(ChannelUpdated {
            channel_id: channel.channel_id.clone(),
            new_balance,
            sequence_number,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Close a payment channel and settle balances
    pub fn close_channel(
        ctx: Context<CloseChannel>,
        final_signature: Option<[u8; 64]>,
    ) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let clock = Clock::get()?;

        require!(
            channel.status == ChannelStatus::Active || channel.status == ChannelStatus::Disputed,
            ChannelError::ChannelNotCloseable
        );

        // If closing cooperatively with both parties' signatures
        if let Some(sig) = final_signature {
            verify_close_signature(&channel, &sig)?;
            settle_channel_immediately(ctx, channel)?;
        } else {
            // Unilateral close - start challenge period
            channel.status = ChannelStatus::Closing;
            channel.challenge_expires_at = Some(clock.unix_timestamp + channel.challenge_period);

            emit!(ChannelClosing {
                channel_id: channel.channel_id.clone(),
                challenge_expires_at: channel.challenge_expires_at.unwrap(),
            });
        }

        Ok(())
    }

    /// Challenge a channel closure with a newer state
    pub fn challenge_close(
        ctx: Context<ChallengeClose>,
        sequence_number: u64,
        balance: u64,
        signature: [u8; 64],
    ) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let clock = Clock::get()?;

        require!(channel.status == ChannelStatus::Closing, ChannelError::NotInChallengePeriod);
        require!(
            clock.unix_timestamp < channel.challenge_expires_at.unwrap(),
            ChannelError::ChallengePeriodExpired
        );
        require!(sequence_number > channel.sequence_number, ChannelError::InvalidSequence);

        // Verify the challenge signature
        verify_challenge_signature(&channel, sequence_number, balance, &signature)?;

        // Update channel with newer state
        channel.sequence_number = sequence_number;
        channel.current_balance = balance;
        channel.total_spent = channel.initial_deposit - balance;

        emit!(ChannelChallenged {
            channel_id: channel.channel_id.clone(),
            new_sequence_number: sequence_number,
            new_balance: balance,
        });

        Ok(())
    }

    /// Finalize channel closure after challenge period
    pub fn finalize_close(ctx: Context<FinalizeClose>) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let clock = Clock::get()?;

        require!(channel.status == ChannelStatus::Closing, ChannelError::NotInChallengePeriod);
        require!(
            clock.unix_timestamp >= channel.challenge_expires_at.unwrap(),
            ChannelError::ChallengePeriodNotExpired
        );

        settle_channel_immediately(ctx, channel)?;

        Ok(())
    }

    /// Handle a disputed transaction
    pub fn dispute_transaction(
        ctx: Context<DisputeTransaction>,
        disputed_payment_id: Pubkey,
        evidence: DisputeEvidence,
    ) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let dispute = &mut ctx.accounts.dispute;

        require!(channel.status == ChannelStatus::Active, ChannelError::ChannelNotActive);

        channel.status = ChannelStatus::Disputed;

        dispute.channel = channel.key();
        dispute.disputed_payment = disputed_payment_id;
        dispute.evidence = evidence.clone();
        dispute.status = DisputeStatus::Open;
        dispute.created_at = Clock::get()?.unix_timestamp;

        emit!(TransactionDisputed {
            channel_id: channel.channel_id.clone(),
            disputed_payment: disputed_payment_id,
            evidence,
        });

        Ok(())
    }

    /// Resolve a dispute
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        resolution: DisputeResolution,
    ) -> Result<()> {
        let channel = &mut ctx.accounts.channel;
        let dispute = &mut ctx.accounts.dispute;

        require!(dispute.status == DisputeStatus::Open, ChannelError::DisputeNotOpen);
        require!(
            ctx.accounts.authority.key() == channel.key(), // Authority check
            ChannelError::Unauthorized
        );

        dispute.status = DisputeStatus::Resolved;
        dispute.resolution = Some(resolution.clone());

        // Apply resolution to channel
        match resolution.outcome {
            DisputeOutcome::FavorUser => {
                // Refund disputed amount to user
                channel.current_balance += resolution.amount;
                channel.total_spent -= resolution.amount;
            }
            DisputeOutcome::FavorOperator => {
                // Payment stands as is
            }
            DisputeOutcome::PartialRefund => {
                // Partial refund to user
                let refund_amount = resolution.amount / 2;
                channel.current_balance += refund_amount;
                channel.total_spent -= refund_amount;
            }
        }

        channel.status = ChannelStatus::Active;

        emit!(DisputeResolved {
            channel_id: channel.channel_id.clone(),
            resolution,
        });

        Ok(())
    }
}

// Helper functions
fn verify_payment_signature(
    channel: &Channel,
    amount: u64,
    service_data: &ServiceData,
    signature: &[u8; 64],
    signer: &Pubkey,
) -> Result<()> {
    // Implement signature verification for payments
    // This would use the user's public key to verify they authorized the payment
    Ok(())
}

fn verify_update_signature(
    channel: &Channel,
    new_balance: u64,
    sequence_number: u64,
    signature: &[u8; 64],
) -> Result<()> {
    // Implement signature verification for channel updates
    // This would verify both user and operator signatures
    Ok(())
}

fn verify_close_signature(channel: &Channel, signature: &[u8; 64]) -> Result<()> {
    // Implement signature verification for cooperative channel close
    Ok(())
}

fn verify_challenge_signature(
    channel: &Channel,
    sequence_number: u64,
    balance: u64,
    signature: &[u8; 64],
) -> Result<()> {
    // Implement signature verification for channel challenges
    Ok(())
}

fn settle_channel_immediately<'info>(
    ctx: Context<'_, '_, '_, 'info, CloseChannel<'info>>,
    channel: &mut Channel,
) -> Result<()> {
    // Transfer remaining balance back to user
    if channel.current_balance > 0 {
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += channel.current_balance;
        **channel.to_account_info().try_borrow_mut_lamports()? -= channel.current_balance;
    }

    // Transfer earned amount to node operator
    if channel.total_spent > 0 {
        **ctx.accounts.node_operator.to_account_info().try_borrow_mut_lamports()? += channel.total_spent;
        **channel.to_account_info().try_borrow_mut_lamports()? -= channel.total_spent;
    }

    channel.status = ChannelStatus::Closed;

    emit!(ChannelClosed {
        channel_id: channel.channel_id.clone(),
        final_user_balance: channel.current_balance,
        final_operator_earnings: channel.total_spent,
    });

    Ok(())
}

// Account structures
#[account]
pub struct ChannelState {
    pub authority: Pubkey,
    pub total_channels: u64,
    pub total_volume: u64,
}

#[account]
pub struct Channel {
    pub channel_id: String,
    pub user: Pubkey,
    pub node_operator: Pubkey,
    pub initial_deposit: u64,
    pub current_balance: u64,
    pub total_spent: u64,
    pub created_at: i64,
    pub expires_at: i64,
    pub status: ChannelStatus,
    pub sequence_number: u64,
    pub challenge_period: i64,
    pub challenge_expires_at: Option<i64>,
    pub last_update: i64,
}

#[account]
pub struct Payment {
    pub channel: Pubkey,
    pub amount: u64,
    pub service_data: ServiceData,
    pub timestamp: i64,
    pub sequence_number: u64,
}

#[account]
pub struct Dispute {
    pub channel: Pubkey,
    pub disputed_payment: Pubkey,
    pub evidence: DisputeEvidence,
    pub status: DisputeStatus,
    pub created_at: i64,
    pub resolution: Option<DisputeResolution>,
}

// Data structures
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ServiceData {
    pub service_type: ServiceType,
    pub data_amount: u64, // bytes transferred
    pub quality_score: u8, // 0-100
    pub duration: u32, // seconds
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DisputeEvidence {
    pub evidence_type: EvidenceType,
    pub description: String,
    pub data_hash: [u8; 32],
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DisputeResolution {
    pub outcome: DisputeOutcome,
    pub amount: u64,
    pub reasoning: String,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ChannelStatus {
    Active,
    Closing,
    Closed,
    Disputed,
    Expired,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ServiceType {
    DataTransfer,
    VoiceCall,
    VideoStream,
    WebBrowsing,
    FileDownload,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum DisputeStatus {
    Open,
    Resolved,
    Escalated,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum DisputeOutcome {
    FavorUser,
    FavorOperator,
    PartialRefund,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum EvidenceType {
    ServiceLog,
    QualityMeasurement,
    NetworkTrace,
    UserComplaint,
}

// Context structures
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8)]
    pub channel_state: Account<'info, ChannelState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(channel_id: String)]
pub struct CreateChannel<'info> {
    #[account(init, payer = user, space = 8 + 500)] // Adjust space as needed
    pub channel: Account<'info, Channel>,
    #[account(mut)]
    pub channel_state: Account<'info, ChannelState>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: Node operator account
    pub node_operator: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MakePayment<'info> {
    #[account(mut, has_one = user)]
    pub channel: Account<'info, Channel>,
    #[account(init, payer = user, space = 8 + 200)]
    pub payment: Account<'info, Payment>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateChannel<'info> {
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseChannel<'info> {
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    #[account(mut)]
    /// CHECK: User account for refund
    pub user: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: Node operator account for payment
    pub node_operator: AccountInfo<'info>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ChallengeClose<'info> {
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    pub challenger: Signer<'info>,
}

#[derive(Accounts)]
pub struct FinalizeClose<'info> {
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    #[account(mut)]
    /// CHECK: User account
    pub user: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: Node operator account
    pub node_operator: AccountInfo<'info>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct DisputeTransaction<'info> {
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    #[account(init, payer = disputer, space = 8 + 300)]
    pub dispute: Account<'info, Dispute>,
    #[account(mut)]
    pub disputer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    #[account(mut)]
    pub dispute: Account<'info, Dispute>,
    pub authority: Signer<'info>,
}

// Events
#[event]
pub struct ChannelCreated {
    pub channel_id: String,
    pub user: Pubkey,
    pub node_operator: Pubkey,
    pub initial_deposit: u64,
    pub expires_at: i64,
}

#[event]
pub struct PaymentMade {
    pub channel_id: String,
    pub user: Pubkey,
    pub node_operator: Pubkey,
    pub amount: u64,
    pub service_data: ServiceData,
    pub sequence_number: u64,
}

#[event]
pub struct ChannelUpdated {
    pub channel_id: String,
    pub new_balance: u64,
    pub sequence_number: u64,
    pub timestamp: i64,
}

#[event]
pub struct ChannelClosing {
    pub channel_id: String,
    pub challenge_expires_at: i64,
}

#[event]
pub struct ChannelChallenged {
    pub channel_id: String,
    pub new_sequence_number: u64,
    pub new_balance: u64,
}

#[event]
pub struct ChannelClosed {
    pub channel_id: String,
    pub final_user_balance: u64,
    pub final_operator_earnings: u64,
}

#[event]
pub struct TransactionDisputed {
    pub channel_id: String,
    pub disputed_payment: Pubkey,
    pub evidence: DisputeEvidence,
}

#[event]
pub struct DisputeResolved {
    pub channel_id: String,
    pub resolution: DisputeResolution,
}

// Errors
#[error_code]
pub enum ChannelError {
    #[msg("Invalid deposit amount")]
    InvalidDeposit,
    #[msg("Invalid duration")]
    InvalidDuration,
    #[msg("Channel is not active")]
    ChannelNotActive,
    #[msg("Channel has expired")]
    ChannelExpired,
    #[msg("Invalid payment amount")]
    InvalidAmount,
    #[msg("Insufficient channel balance")]
    InsufficientBalance,
    #[msg("Invalid sequence number")]
    InvalidSequence,
    #[msg("Invalid balance")]
    InvalidBalance,
    #[msg("Channel cannot be closed in current state")]
    ChannelNotCloseable,
    #[msg("Not in challenge period")]
    NotInChallengePeriod,
    #[msg("Challenge period has expired")]
    ChallengePeriodExpired,
    #[msg("Challenge period has not expired")]
    ChallengePeriodNotExpired,
    #[msg("Dispute is not open")]
    DisputeNotOpen,
    #[msg("Unauthorized access")]
    Unauthorized,
}
