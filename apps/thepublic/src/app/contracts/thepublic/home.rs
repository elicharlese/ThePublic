use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};
use std::collections::HashMap;

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct HomeContract {
    identities: HashMap<String, User>,
    contributions: HashMap<String, u64>,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct User {
    username: String,
    email: String,
}

#[near_bindgen]
impl HomeContract {
    // Method to add or update a user
    pub fn add_or_update_user(&mut self, account_id: String, username: String, email: String) {
        let user = User { username, email };
        self.identities.insert(account_id.clone(), user);
        env::log_str(&format!("User {} updated data successfully", account_id));
    }

    // Method to get a user's data
    pub fn get_user(&self, account_id: String) -> Option<User> {
        self.identities.get(&account_id).cloned()
    }

    // Method to add contributions
    pub fn add_contribution(&mut self, account_id: String, points: u64) {
        let counter = self.contributions.entry(account_id.clone()).or_insert(0);
        *counter += points;
        env::log_str(&format!("User {} now has {} points", account_id, *counter));
    }

    // Method to get user's contributions
    pub fn get_contribution(&self, account_id: String) -> u64 {
        *self.contributions.get(&account_id).unwrap_or(&0)
    }
}