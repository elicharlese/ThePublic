// interfaces/social_network.rs

pub trait SocialNetwork {
    fn send_message(&mut self, receiver: String, content: String);
    fn get_messages(&self, account_id: String) -> Vec<String>;
    fn add_tag(&mut self, account_id: String, label: String);
    fn get_tagged_accounts(&self, label: String) -> Vec<String>;
    fn add_bookmark(&mut self, content_id: String, title: String, url: String);
    fn get_bookmarks(&self, account_id: String) -> Vec<String>;
    fn create_collection(&mut self, name: String);
    fn add_bookmark_to_collection(&mut self, collection_name: String, bookmark: String);
    fn get_collections(&self, account_id: String) -> Vec<String>;
}