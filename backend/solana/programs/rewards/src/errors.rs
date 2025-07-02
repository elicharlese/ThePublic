use anchor_lang::prelude::*;

#[error_code]
pub enum RewardsError {
    #[msg("Mismatched array lengths")]
    MismatchedArrayLengths,
    #[msg("Insufficient vault balance")]
    InsufficientVaultBalance,
    #[msg("Insufficient pending rewards")]
    InsufficientPendingRewards,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid reward amount")]
    InvalidRewardAmount,
    #[msg("Reward period not ready")]
    RewardPeriodNotReady,
    #[msg("Node not eligible for rewards")]
    NodeNotEligible,
    #[msg("Distribution already completed")]
    DistributionAlreadyCompleted,
}
