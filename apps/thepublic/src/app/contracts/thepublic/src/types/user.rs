// types/user.rs

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};

#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub username: String,
    pub bio: String,
    pub email: String,
    pub authenticated: bool,
}