// interfaces/network.rs

pub trait Network {
    fn get_all_settings(&self) -> Vec<String>;
    fn get_setting_by_id(&self, id: String) -> Option<String>;
    fn create_setting(&mut self, setting: String);
    fn update_setting(&mut self, id: String, setting: String);
    fn delete_setting(&mut self, id: String);
}