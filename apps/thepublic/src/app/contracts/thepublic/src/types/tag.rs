// types/tag.rs

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Serialize, Deserialize};

#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize, Deserialize, Eq, PartialEq, Hash)]
pub struct Tag {
    pub label: String,
}