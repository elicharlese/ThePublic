use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{
    near_bindgen, env, AccountId, PanicOnDefault, Promise, Gas,
};
use std::collections::HashMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct WifiSharing {
    owner: AccountId,
    wifi_credentials: WifiCredentials,
    authorized_users: HashMap<AccountId, bool>,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct WifiCredentials {
    ssid: String,
    password: String,
}

#[near_bindgen]
impl WifiSharing {
    #[init]
    pub fn new(owner: AccountId, ssid: String, password: String) -> Self {
        Self {
            owner,
            wifi_credentials: WifiCredentials { ssid, password },
            authorized_users: HashMap::new(),
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
}