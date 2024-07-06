// types/collection.rs

use super::bookmark::Bookmark;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Serialize, Deserialize};

#[derive(BorshDeserialize, BorshSerialize, Clone, Serialize, Deserialize)]
pub struct Collection {
    pub name: String,
    pub bookmarks: Vec<Bookmark>,
}