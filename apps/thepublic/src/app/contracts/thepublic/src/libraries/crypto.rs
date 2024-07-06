// libraries/crypto.rs

use near_sdk::env;
use sha2::{Digest, Sha256};

pub fn hash_data(data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hasher.finalize().to_vec()
}

pub fn verify_signature(data: &[u8], signature: &[u8], public_key: &[u8]) -> bool {
    // Placeholder for actual signature verification logic
    true
}