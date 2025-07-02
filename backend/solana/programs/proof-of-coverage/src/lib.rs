use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use std::collections::HashMap;

declare_id!("ProofCoverageProgram1111111111111111111111");

#[program]
pub mod proof_of_coverage {
    use super::*;

    /// Initialize the proof of coverage program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let coverage_state = &mut ctx.accounts.coverage_state;
        coverage_state.authority = ctx.accounts.authority.key();
        coverage_state.total_nodes = 0;
        coverage_state.coverage_challenges = 0;
        Ok(())
    }

    /// Register a node for proof of coverage
    pub fn register_node(
        ctx: Context<RegisterNode>,
        location: Location,
        hardware_specs: HardwareSpecs,
    ) -> Result<()> {
        let node_account = &mut ctx.accounts.node_account;
        let coverage_state = &mut ctx.accounts.coverage_state;

        node_account.owner = ctx.accounts.owner.key();
        node_account.location = location;
        node_account.hardware_specs = hardware_specs;
        node_account.status = NodeStatus::Active;
        node_account.uptime_percentage = 0.0;
        node_account.last_challenge = 0;
        node_account.challenges_passed = 0;
        node_account.challenges_failed = 0;
        node_account.coverage_score = 0.0;

        coverage_state.total_nodes += 1;

        emit!(NodeRegistered {
            node_id: node_account.key(),
            owner: ctx.accounts.owner.key(),
            location: location,
        });

        Ok(())
    }

    /// Submit proof of coverage challenge
    pub fn submit_coverage_proof(
        ctx: Context<SubmitCoverageProof>,
        challenge_id: u64,
        proof_data: ProofData,
    ) -> Result<()> {
        let node_account = &mut ctx.accounts.node_account;
        let coverage_state = &mut ctx.accounts.coverage_state;
        let clock = Clock::get()?;

        // Verify the proof is recent (within last 10 minutes)
        require!(
            clock.unix_timestamp - proof_data.timestamp < 600,
            CoverageError::ProofTooOld
        );

        // Verify the challenge ID matches
        require!(
            challenge_id == node_account.last_challenge + 1,
            CoverageError::InvalidChallengeId
        );

        // Validate the proof data
        let is_valid = validate_coverage_proof(&proof_data, &node_account.location)?;

        if is_valid {
            node_account.challenges_passed += 1;
            node_account.coverage_score = calculate_coverage_score(node_account);
            
            // Update uptime based on successful proof
            update_uptime(node_account, true);

            emit!(CoverageProofSubmitted {
                node_id: node_account.key(),
                challenge_id,
                success: true,
                coverage_score: node_account.coverage_score,
            });
        } else {
            node_account.challenges_failed += 1;
            update_uptime(node_account, false);

            emit!(CoverageProofSubmitted {
                node_id: node_account.key(),
                challenge_id,
                success: false,
                coverage_score: node_account.coverage_score,
            });
        }

        node_account.last_challenge = challenge_id;
        coverage_state.coverage_challenges += 1;

        Ok(())
    }

    /// Issue a coverage challenge to a node
    pub fn issue_challenge(
        ctx: Context<IssueChallenge>,
        target_node: Pubkey,
        challenge_type: ChallengeType,
    ) -> Result<()> {
        let challenge_account = &mut ctx.accounts.challenge_account;
        let clock = Clock::get()?;

        challenge_account.target_node = target_node;
        challenge_account.challenge_type = challenge_type;
        challenge_account.issued_at = clock.unix_timestamp;
        challenge_account.expires_at = clock.unix_timestamp + 300; // 5 minutes to respond
        challenge_account.status = ChallengeStatus::Pending;

        emit!(ChallengeIssued {
            challenge_id: challenge_account.key(),
            target_node,
            challenge_type,
            expires_at: challenge_account.expires_at,
        });

        Ok(())
    }

    /// Verify network coverage across multiple nodes
    pub fn verify_network_coverage(
        ctx: Context<VerifyNetworkCoverage>,
        region: Region,
    ) -> Result<()> {
        let coverage_state = &mut ctx.accounts.coverage_state;
        
        // Calculate coverage density for the region
        let coverage_density = calculate_region_coverage(&region, &ctx.remaining_accounts)?;
        
        // Update regional coverage statistics
        update_regional_stats(coverage_state, region, coverage_density);

        emit!(NetworkCoverageVerified {
            region,
            coverage_density,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// Helper functions
fn validate_coverage_proof(proof: &ProofData, location: &Location) -> Result<bool> {
    // Implement proof validation logic
    // This would include:
    // 1. Signal strength measurements
    // 2. Latency tests to nearby nodes
    // 3. Geographic verification
    // 4. Cryptographic proof verification

    let signal_strength_valid = proof.signal_strength > 70.0; // dBm threshold
    let latency_valid = proof.average_latency < 50.0; // ms threshold
    let location_valid = verify_location_proof(proof, location)?;

    Ok(signal_strength_valid && latency_valid && location_valid)
}

fn verify_location_proof(proof: &ProofData, claimed_location: &Location) -> Result<bool> {
    // Verify the node is actually at the claimed location
    // This could use GPS data, triangulation, or other methods
    
    let distance = calculate_distance(&proof.gps_coordinates, &claimed_location.coordinates);
    Ok(distance < 100.0) // Allow 100m variance
}

fn calculate_coverage_score(node: &NodeAccount) -> f64 {
    let total_challenges = node.challenges_passed + node.challenges_failed;
    if total_challenges == 0 {
        return 0.0;
    }

    let success_rate = node.challenges_passed as f64 / total_challenges as f64;
    let uptime_factor = node.uptime_percentage / 100.0;
    
    // Weighted score: 70% success rate, 30% uptime
    (success_rate * 0.7 + uptime_factor * 0.3) * 100.0
}

fn update_uptime(node: &mut NodeAccount, successful_proof: bool) {
    // Update uptime percentage based on proof results
    // This is a simplified implementation
    if successful_proof {
        node.uptime_percentage = (node.uptime_percentage * 0.95) + (100.0 * 0.05);
    } else {
        node.uptime_percentage = (node.uptime_percentage * 0.95) + (0.0 * 0.05);
    }
}

fn calculate_region_coverage(region: &Region, nodes: &[AccountInfo]) -> Result<f64> {
    // Calculate coverage density for a region
    // This would involve complex geographic calculations
    let active_nodes = count_active_nodes_in_region(region, nodes)?;
    let required_nodes = calculate_required_nodes(region);
    
    Ok((active_nodes as f64 / required_nodes as f64).min(1.0) * 100.0)
}

fn count_active_nodes_in_region(region: &Region, nodes: &[AccountInfo]) -> Result<u32> {
    // Count active nodes within the region boundaries
    let mut count = 0;
    
    for node_info in nodes {
        // Parse node account and check if it's in the region
        // This is simplified - real implementation would deserialize accounts
        count += 1;
    }
    
    Ok(count)
}

fn calculate_required_nodes(region: &Region) -> u32 {
    // Calculate required nodes based on region area and population density
    let area = region.area_km2;
    let population_density = region.population_density;
    
    // Formula: base coverage + population factor
    let base_nodes = (area / 100.0) as u32; // 1 node per 100 km²
    let population_factor = (population_density / 1000.0) as u32; // Additional nodes for dense areas
    
    base_nodes + population_factor
}

fn update_regional_stats(
    coverage_state: &mut CoverageState,
    region: Region,
    coverage_density: f64,
) {
    // Update regional coverage statistics
    // This would store regional data in the state
}

fn calculate_distance(coord1: &Coordinates, coord2: &Coordinates) -> f64 {
    // Haversine formula for calculating distance between two GPS coordinates
    let lat1_rad = coord1.latitude.to_radians();
    let lat2_rad = coord2.latitude.to_radians();
    let delta_lat = (coord2.latitude - coord1.latitude).to_radians();
    let delta_lon = (coord2.longitude - coord1.longitude).to_radians();

    let a = (delta_lat / 2.0).sin().powi(2)
        + lat1_rad.cos() * lat2_rad.cos() * (delta_lon / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());

    6371.0 * c * 1000.0 // Result in meters
}

// Account structures
#[account]
pub struct CoverageState {
    pub authority: Pubkey,
    pub total_nodes: u64,
    pub coverage_challenges: u64,
}

#[account]
pub struct NodeAccount {
    pub owner: Pubkey,
    pub location: Location,
    pub hardware_specs: HardwareSpecs,
    pub status: NodeStatus,
    pub uptime_percentage: f64,
    pub last_challenge: u64,
    pub challenges_passed: u64,
    pub challenges_failed: u64,
    pub coverage_score: f64,
}

#[account]
pub struct ChallengeAccount {
    pub target_node: Pubkey,
    pub challenge_type: ChallengeType,
    pub issued_at: i64,
    pub expires_at: i64,
    pub status: ChallengeStatus,
}

// Data structures
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Location {
    pub coordinates: Coordinates,
    pub region: String,
    pub country: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Coordinates {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct HardwareSpecs {
    pub cpu_cores: u8,
    pub memory_gb: u16,
    pub storage_gb: u32,
    pub bandwidth_mbps: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProofData {
    pub timestamp: i64,
    pub signal_strength: f64,
    pub average_latency: f64,
    pub gps_coordinates: Coordinates,
    pub network_measurements: Vec<NetworkMeasurement>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct NetworkMeasurement {
    pub peer_node: Pubkey,
    pub latency_ms: f64,
    pub bandwidth_mbps: f64,
    pub packet_loss: f64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Region {
    pub name: String,
    pub area_km2: f64,
    pub population_density: f64,
    pub boundaries: Vec<Coordinates>,
}

// Enums
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum NodeStatus {
    Active,
    Inactive,
    Suspended,
    Maintenance,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ChallengeType {
    PingTest,
    SpeedTest,
    LocationVerification,
    NetworkMeasurement,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum ChallengeStatus {
    Pending,
    Completed,
    Failed,
    Expired,
}

// Context structures
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8)]
    pub coverage_state: Account<'info, CoverageState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterNode<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 200)] // Adjust space as needed
    pub node_account: Account<'info, NodeAccount>,
    #[account(mut)]
    pub coverage_state: Account<'info, CoverageState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitCoverageProof<'info> {
    #[account(mut, has_one = owner)]
    pub node_account: Account<'info, NodeAccount>,
    #[account(mut)]
    pub coverage_state: Account<'info, CoverageState>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct IssueChallenge<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 1 + 8 + 8 + 1)]
    pub challenge_account: Account<'info, ChallengeAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyNetworkCoverage<'info> {
    #[account(mut)]
    pub coverage_state: Account<'info, CoverageState>,
    pub authority: Signer<'info>,
}

// Events
#[event]
pub struct NodeRegistered {
    pub node_id: Pubkey,
    pub owner: Pubkey,
    pub location: Location,
}

#[event]
pub struct CoverageProofSubmitted {
    pub node_id: Pubkey,
    pub challenge_id: u64,
    pub success: bool,
    pub coverage_score: f64,
}

#[event]
pub struct ChallengeIssued {
    pub challenge_id: Pubkey,
    pub target_node: Pubkey,
    pub challenge_type: ChallengeType,
    pub expires_at: i64,
}

#[event]
pub struct NetworkCoverageVerified {
    pub region: Region,
    pub coverage_density: f64,
    pub timestamp: i64,
}

// Errors
#[error_code]
pub enum CoverageError {
    #[msg("Proof is too old")]
    ProofTooOld,
    #[msg("Invalid challenge ID")]
    InvalidChallengeId,
    #[msg("Challenge has expired")]
    ChallengeExpired,
    #[msg("Insufficient coverage proof")]
    InsufficientCoverage,
    #[msg("Invalid location verification")]
    InvalidLocation,
}
