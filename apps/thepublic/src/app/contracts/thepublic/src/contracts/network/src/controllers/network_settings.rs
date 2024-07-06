// controllers/network_settings.rs

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkSetting {
    pub setting_name: String,
    pub value: String,
    pub description: Option<String>,
}

pub fn validate_setting(setting: &NetworkSetting) -> Result<(), String> {
    if setting.setting_name.is_empty() {
        return Err("Setting name is required".to_string());
    }

    if setting.value.is_empty() {
        return Err("Value is required".to_string());
    }

    Ok(())
}