use anchor_lang::prelude::*;

#[error_code]
pub enum NodeRegistryError {
    #[msg("Invalid location coordinates")]
    InvalidLocation,
    #[msg("Invalid performance metrics")]
    InvalidMetrics,
    #[msg("Node not found")]
    NodeNotFound,
    #[msg("Unauthorized operation")]
    Unauthorized,
    #[msg("Node already exists")]
    NodeAlreadyExists,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid node status")]
    InvalidNodeStatus,
    #[msg("Reputation too low")]
    ReputationTooLow,
}
