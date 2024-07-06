// types/message.rs

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Serialize, Deserialize};

#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize, Deserialize)]
pub struct Message {
    pub sender: String,
    pub receiver: String,
    pub content: String,
    pub timestamp: u64,
}