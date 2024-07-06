// types/bookmark.rs

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Serialize, Deserialize};

#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize, Deserialize)]
pub struct Bookmark {
    pub content_id: String,
    pub title: String,
    pub url: String,
    pub timestamp: u64,
}