mod libraries;
mod interfaces;
mod types;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault};
use std::collections::HashMap;
use crate::interfaces::UserManagement;
use crate::libraries::{logging, errors::ContractError};
use crate::types::UserProfile;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct UserManagementContract {
    users: HashMap<AccountId, UserProfile>,
}

#[near_bindgen]
impl UserManagement for UserManagementContract {
    fn register_user(&mut self, username: String, bio: String, email: String) {
        logging::log_info("Registering user");
        let account_id = env::predecessor_account_id();

        if self.users.contains_key(&account_id) {
            env::panic_str("User already registered");
        }

        let profile = UserProfile {
            username,
            bio,
            email,
            authenticated: false,
        };
        self.users.insert(account_id, profile);
    }

    fn authenticate_user(&mut self) -> bool {
        logging::log_info("Authenticating user");
        let account_id = env::predecessor_account_id();

        if let Some(user) = self.users.get_mut(&account_id) {
            user.authenticated = true;
            true
        } else {
            false
        }
    }

    fn get_user_profile(&self, account_id: String) -> Option<String> {
        logging::log_info(&format!("Fetching profile for account: {}", account_id));
        self.users.get(&account_id).map(|profile| format!("{:?}", profile))
    }

    fn update_user_profile(&mut self, username: Option<String>, bio: Option<String>, email: Option<String>) {
        logging::log_info("Updating user profile");
        let account_id = env::predecessor_account_id();

        if let Some(user) = self.users.get_mut(&account_id) {
            if let Some(un) = username {
                user.username = un;
            }
            if let Some(b) = bio {
                user.bio = b;
            }
            if let Some(em) = email {
                user.email = em;
            }
        } else {
            env::panic_str("User not found");
        }
    }
}

#[near_bindgen]
impl UserManagementContract {
    #[init]
    pub fn new() -> Self {
        logging::log_info("Initializing UserManagementContract");
        Self {
            users: HashMap::new(),
        }
    }
}