mod libraries;
mod interfaces;
mod types;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault};
use std::collections::HashMap;
use crate::interfaces::SocialNetwork;
use crate::libraries::{logging, utils};
use crate::types::{Message, Tag, Bookmark, Collection};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct SocialNetworkContract {
    messages: HashMap<AccountId, Vec<Message>>,
    tags: HashMap<Tag, Vec<AccountId>>,
    bookmarks: HashMap<AccountId, Vec<Bookmark>>,
    collections: HashMap<AccountId, Vec<Collection>>,
}

#[near_bindgen]
impl SocialNetwork for SocialNetworkContract {
    fn send_message(&mut self, receiver: String, content: String) {
        logging::log_info(&format!("Sending message to: {}", receiver));
        let sender = env::predecessor_account_id();
        let message = Message {
            sender: sender.clone(),
            receiver: receiver.clone(),
            content,
            timestamp: env::block_timestamp(),
        };
        self.messages.entry(receiver).or_insert_with(Vec::new).push(message);
    }

    fn get_messages(&self, account_id: String) -> Vec<String> {
        logging::log_info(&format!("Fetching messages for account: {}", account_id));
        self.messages.get(&account_id).cloned().unwrap_or_default()
            .into_iter()
            .map(|message| format!("{:?}", message))
            .collect()
    }

    fn add_tag(&mut self, account_id: String, label: String) {
        logging::log_info(&format!("Adding tag: {} to account: {}", label, account_id));
        let tag = Tag { label };
        self.tags.entry(tag).or_insert_with(Vec::new).push(account_id);
    }

    fn get_tagged_accounts(&self, label: String) -> Vec<String> {
        logging::log_info(&format!("Fetching tagged accounts for label: {}", label));
        let tag = Tag { label };
        self.tags.get(&tag).cloned().unwrap_or_default()
    }

    fn add_bookmark(&mut self, content_id: String, title: String, url: String) {
        logging::log_info(&format!("Adding bookmark: {} with title: {}", content_id, title));
        let account_id = env::predecessor_account_id();
        let bookmark = Bookmark {
            content_id,
            title,
            url,
            timestamp: env::block_timestamp(),
        };
        self.bookmarks.entry(account_id.clone()).or_insert_with(Vec::new).push(bookmark);
    }

    fn get_bookmarks(&self, account_id: String) -> Vec<String> {
        logging::log_info(&format!("Fetching bookmarks for account: {}", account_id));
        self.bookmarks.get(&account_id).cloned().unwrap_or_default()
            .into_iter()
            .map(|bookmark| format!("{:?}", bookmark))
            .collect()
    }

    fn create_collection(&mut self, name: String) {
        logging::log_info(&format!("Creating collection: {}", name));
        let account_id = env::predecessor_account_id();
        let collection = Collection {
            name: name.clone(),
            bookmarks: vec![],
        };
        self.collections.entry(account_id.clone()).or_insert_with(Vec::new).push(collection);
    }

    fn add_bookmark_to_collection(&mut self, collection_name: String, bookmark: String) {
        logging::log_info(&format!("Adding bookmark to collection: {}", collection_name));
        let account_id = env::predecessor_account_id();
        if let Some(collections) = self.collections.get_mut(&account_id) {
            if let Some(collection) = collections.iter_mut().find(|c| c.name == collection_name) {
                collection.bookmarks.push(serde_json::from_str(&bookmark).expect("Invalid Bookmark"));
            }
        }
    }

    fn get_collections(&self, account_id: String) -> Vec<String> {
        logging::log_info(&format!("Fetching collections for account: {}", account_id));
        self.collections.get(&account_id).cloned().unwrap_or_default()
            .into_iter()
            .map(|collection| format!("{:?}", collection))
            .collect()
    }
}

#[near_bindgen]
impl SocialNetworkContract {
    #[init]
    pub fn new() -> Self {
        logging::log_info("Initializing SocialNetworkContract");
        Self {
            messages: HashMap::new(),
            tags: HashMap::new(),
            bookmarks: HashMap::new(),
            collections: HashMap::new(),
        }
    }
}