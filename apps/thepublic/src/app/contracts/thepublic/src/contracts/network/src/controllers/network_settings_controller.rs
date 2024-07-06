// controllers/network_settings_controller.rs

use crate::models::network_settings::{NetworkSetting, validate_setting};
use std::collections::HashMap;

pub struct NetworkSettingsManager {
    settings: HashMap<String, NetworkSetting>,
}

impl NetworkSettingsManager {
    pub fn new() -> Self {
        Self {
            settings: HashMap::new(),
        }
    }

    pub fn get_all_settings(&self) -> Vec<NetworkSetting> {
        self.settings.values().cloned().collect()
    }

    pub fn get_setting_by_id(&self, id: &str) -> Option<NetworkSetting> {
        self.settings.get(id).cloned()
    }

    pub fn create_network_setting(&mut self, setting: NetworkSetting) -> Result<(), String> {
        validate_setting(&setting)?;
        self.settings.insert(setting.setting_name.clone(), setting);
        Ok(())
    }

    pub fn update_network_setting(&mut self, id: &str, new_setting: NetworkSetting) -> Result<(), String> {
        if self.settings.contains_key(id) {
            validate_setting(&new_setting)?;
            self.settings.insert(id.to_string(), new_setting);
            Ok(())
        } else {
            Err("Setting not found".to_string())
        }
    }

    pub fn delete_network_setting(&mut self, id: &str) -> Result<(), String> {
        if self.settings.remove(id).is_some() {
            Ok(())
        } else {
            Err("Setting not found".to_string())
        }
    }
}