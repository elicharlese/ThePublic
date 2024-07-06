// interfaces/user_management.rs

pub trait UserManagement {
    fn register_user(&mut self, username: String, bio: String, email: String);
    fn authenticate_user(&mut self) -> bool;
    fn get_user_profile(&self, account_id: String) -> Option<String>;
    fn update_user_profile(&mut self, username: Option<String>, bio: Option<String>, email: Option<String>);
}