use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};
use std::collections::HashMap;

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct SocialContract {
    wifi_share_info: HashMap<String, String>,
    posts: HashMap<String, Vec<Post>>,
    followers: HashMap<String, Vec<String>>,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Post {
    content: String,
    timestamp: u64,
}

#[near_bindgen]
impl SocialContract {
    // Method to share Wi-Fi information
    pub fn share_wifi(&mut self, account_id: String, wifi_ssid: String, wifi_password: String) {
        let connection_info = format!("SSID: {}, Password: {}", wifi_ssid, wifi_password);
        self.wifi_share_info.insert(account_id.clone(), connection_info);
        env::log_str(&format!("User {} shared Wi-Fi details", account_id));
    }

    // Method to get Wi-Fi information shared by a user
    pub fn get_wifi_info(&self, account_id: String) -> Option<String> {
        self.wifi_share_info.get(&account_id).cloned()
    }

    // Method to create a post
    pub fn create_post(&mut self, account_id: String, content: String) {
        let post = Post {
            content,
            timestamp: env::block_timestamp(),
        };

        let user_posts = self.posts.entry(account_id.clone()).or_insert(Vec::new());
        user_posts.push(post);

        env::log_str(&format!("User {} created a new post", account_id));
    }

    // Method to get posts of a user
    pub fn get_posts(&self, account_id: String) -> Option<Vec<Post>> {
        self.posts.get(&account_id).cloned()
    }

    // Method to follow another user
    pub fn follow_user(&mut self, account_id: String, user_to_follow: String) {
        let user_followers = self.followers.entry(account_id.clone()).or_insert(Vec::new());
        if !user_followers.contains(&user_to_follow) {
            user_followers.push(user_to_follow.clone());
            env::log_str(&format!("User {} followed {}", account_id, user_to_follow));
        }
    }

    // Method to get followers of a user
    pub fn get_followers(&self, account_id: String) -> Option<Vec<String>> {
        self.followers.get(&account_id).cloned()
    }

    // Method to get following of a user
    pub fn get_following(&self, account_id: String) -> Option<Vec<String>> {
        let mut following = Vec::new();
        for (user, followers) in &self.followers {
            if followers.contains(&account_id) {
                following.push(user.clone());
            }
        }
        Some(following)
    }
}