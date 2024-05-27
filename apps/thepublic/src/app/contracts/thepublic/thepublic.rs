use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{
    env, near_bindgen,
    json_types::U128,
    serde::{Deserialize, Serialize},
    AccountId, Gas, Promise,
};
use std::collections::HashMap;

const ACCOUNT_CONTRACT_ID: &str = "account_contract.testnet"; // Dummy address, replace with actual
const SOCIAL_CONTRACT_ID: &str = "social_contract.testnet"; // Dummy address, replace with actual

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct ThePublicContract {
    user_data: HashMap<AccountId, UserData>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct UserData {
    username: String,
    email: String,
    social_data: SocialData,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct SocialData {
    posts: Vec<Post>,
    followers: Vec<AccountId>,
    following: Vec<AccountId>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Post {
    content: String,
    timestamp: u64,
}

#[near_bindgen]
impl ThePublicContract {
    // Integrates with account smart contract to fetch user data
    pub fn fetch_account_data(&mut self, account_id: AccountId) -> Promise {
        let account_contract = AccountId::new_unchecked(ACCOUNT_CONTRACT_ID.to_string());
        let promise = Promise::new(account_contract).function_call(
            "get_account".to_string(),
            serde_json::json!({
                "account_id": account_id
            })
            .to_string()
            .into_bytes(),
            0,
            Gas(5_000_000_000_000), // Gas limit
        );
        promise
    }

    // Integrates with social smart contract to fetch social data
    pub fn fetch_social_data(&mut self, account_id: AccountId) -> Promise {
        let social_contract = AccountId::new_unchecked(SOCIAL_CONTRACT_ID.to_string());
        let promise = Promise::new(social_contract).function_call(
            "get_posts".to_string(),
            serde_json::json!({
                "account_id": account_id
            })
            .to_string()
            .into_bytes(),
            0,
            Gas(5_000_000_000_000), // Gas limit
        )
        .and(
            Promise::new(social_contract.clone()).function_call(
                "get_followers".to_string(),
                serde_json::json!({
                    "account_id": account_id
                })
                .to_string()
                .into_bytes(),
                0,
                Gas(5_000_000_000_000), // Gas limit
            )
        )
        .and(
            Promise::new(social_contract).function_call(
                "get_following".to_string(),
                serde_json::json!({
                    "account_id": account_id
                })
                .to_string()
                .into_bytes(),
                0,
                Gas(5_000_000_000_000), // Gas limit
            )
        );
        promise
    }

    // Combines account and social data
    pub fn combine_data(
        &mut self,
        account_id: AccountId,
        username: String,
        email: String,
        posts: Vec<Post>,
        followers: Vec<AccountId>,
        following: Vec<AccountId>,
    ) {
        let social_data = SocialData {
            posts,
            followers,
            following,
        };
        let user_data = UserData {
            username,
            email,
            social_data,
        };
        self.user_data.insert(account_id, user_data);
    }

    // View method to get combined user data
    pub fn get_user_data(&self, account_id: AccountId) -> Option<UserData> {
        self.user_data.get(&account_id).cloned()
    }

    // Update method to update user data
    pub fn update_user_data(
        &mut self,
        account_id: AccountId,
        username: Option<String>,
        email: Option<String>,
        posts: Option<Vec<Post>>,
        followers: Option<Vec<AccountId>>,
        following: Option<Vec<AccountId>>,
    ) {
        if let Some(user_data) = self.user_data.get_mut(&account_id) {
            if let Some(username) = username {
                user_data.username = username;
            }
            if let Some(email) = email {
                user_data.email = email;
            }
            if let Some(posts) = posts {
                user_data.social_data.posts = posts;
            }
            if let Some(followers) = followers {
                user_data.social_data.followers = followers;
            }
            if let Some(following) = following {
                user_data.social_data.following = following;
            }
        }
    }
}