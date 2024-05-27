// apps/thepublic/src/app/contracts/thepublic/network.rs

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{
    near_bindgen, env, AccountId, PanicOnDefault, Promise, Gas,
};
use std::collections::HashMap;

const ADVANCED_SETTINGS_KEY: &str = "advanced_settings";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct WifiSharing {
    owner: AccountId,
    wifi_credentials: WifiCredentials,
    authorized_users: HashMap<AccountId, bool>,
    advanced_settings: AdvancedSettings,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct WifiCredentials {
    ssid: String,
    password: String,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct AdvancedSettings {
    network_timeout: u64,
    max_transaction_fee: u128,
    custom_nodes: HashMap<AccountId, bool>,
}

impl Default for AdvancedSettings {
    fn default() -> Self {
        Self {
            network_timeout: 300,
            max_transaction_fee: 1000,
            custom_nodes: HashMap::new(),
        }
    }
}

#[near_bindgen]
impl WifiSharing {
    #[init]
    pub fn new(owner: AccountId, ssid: String, password: String, network_timeout: u64, max_transaction_fee: u128) -> Self {
        Self {
            owner,
            wifi_credentials: WifiCredentials { ssid, password },
            authorized_users: HashMap::new(),
            advanced_settings: AdvancedSettings { 
                network_timeout, 
                max_transaction_fee, 
                custom_nodes: HashMap::new(),
            },
        }
    }

    pub fn request_access(&mut self) -> Promise {
        let requester = env::predecessor_account_id();
        assert!(
            requester != self.owner,
            "Owner cannot request access"
        );
        Promise::new(self.owner.clone()).function_call(
            "authorize_user".to_string(),
            requester.into_bytes(),
            0,
            Gas(5_000_000_000_000),
        )
    }

    pub fn authorize_user(&mut self, account_id: AccountId) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner,
            "Only owner can authorize users"
        );
        self.authorized_users.insert(account_id, true);
    }

    pub fn get_wifi_credentials(&self, account_id: AccountId) -> Option<WifiCredentials> {
        self.authorized_users.get(&account_id).and_then(|&authorized| {
            if authorized {
                Some(self.wifi_credentials.clone())
            } else {
                None
            }
        })
    }

    pub fn update_advanced_settings(&mut self, network_timeout: u64, max_transaction_fee: u128) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner,
            "Only owner can update settings"
        );
        self.advanced_settings.network_timeout = network_timeout;
        self.advanced_settings.max_transaction_fee = max_transaction_fee;
    }

    pub fn set_custom_node(&mut self, node: AccountId, allowed: bool) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner,
            "Only owner can set custom node"
        );
        self.advanced_settings.custom_nodes.insert(node, allowed);
    }

    pub fn get_advanced_settings(&self) -> AdvancedSettings {
        self.advanced_settings.clone()
    }
}