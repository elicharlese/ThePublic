// controllers/mod.rs

mod network;
mod network_settings;
mod network_settings_controller;

use network::*;
use network_settings_controller::NetworkSettingsManager;
use network_settings_controller::*;

pub struct Controllers {
    network_manager: String,
    settings_manager: NetworkSettingsManager,
}

impl Controllers {
    pub fn new() -> Self {
        Self {
            network_manager: get_network_manager(),
            settings_manager: NetworkSettingsManager::new(),
        }
    }

    pub fn initialize(&self) {
        println!("{}", self.network_manager);
    }

    // Network Setting CRUD Operations
    pub fn get_all_network_settings(&self) -> Vec<NetworkSetting> {
        self.settings_manager.get_all_settings()
    }

    pub fn get_network_setting_by_id(&self, id: &str) -> Option<NetworkSetting> {
        self.settings_manager.get_setting_by_id(id)
    }

    pub fn create_network_setting(&mut self, setting: NetworkSetting) -> Result<(), String> {
        self.settings_manager.create_network_setting(setting)
    }

    pub fn update_network_setting(&mut self, id: &str, setting: NetworkSetting) -> Result<(), String> {
        self.settings_manager.update_network_setting(id, setting)
    }

    pub fn delete_network_setting(&mut self, id: &str) -> Result<(), String> {
        self.settings_manager.delete_network_setting(id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_network_setting() {
        let mut controller = Controllers::new();
        let setting = NetworkSetting {
            setting_name: "TestSetting".to_string(),
            value: "TestValue".to_string(),
            description: None,
        };
        assert_eq!(controller.create_network_setting(setting.clone()), Ok(()));
        let fetched_setting = controller.get_network_setting_by_id("TestSetting").unwrap();
        assert_eq!(fetched_setting.setting_name, "TestSetting");
    }

    // Add more tests for retrieving, updating, and deleting settings
}