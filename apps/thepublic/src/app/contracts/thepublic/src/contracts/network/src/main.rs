mod controllers;
mod middleware;
mod platforms;
mod routes;
mod services;
mod libraries;
mod interfaces;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault};
use std::collections::HashMap;
use crate::interfaces::Network;
use crate::libraries::{logging, errors::ContractError};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct NetworkContract {
    owner: AccountId,
    settings: HashMap<String, String>,
}

#[near_bindgen]
impl NetworkContract {
    #[init]
    pub fn new(owner: AccountId) -> Self {
        logging::log_info("Initializing NetworkContract");
        Self {
            owner,
            settings: HashMap::new(),
        }
    }

    pub fn handle_request(&self, request: String) -> String {
        logging::log_info(&format!("Handling request: {}", request));
        routes::route_request(&request)
    }

    pub fn start_scan(&self, target: String) -> Result<HashMap<String, String>, String> {
        logging::log_info(&format!("Starting scan for target: {}", target));
        match services::start_nmap_scan(&target) {
            Ok(result) => Ok(result),
            Err(e) => {
                logging::log_error(&format!("Scan failed: {}", e));
                Err(e.to_string())
            }
        }
    }

    pub fn connect_hub(&self, hub_address: String) -> Result<(), String> {
        logging::log_info(&format!("Connecting to hub: {}", hub_address));
        services::connect_to_remote_hub(&hub_address).map_err(|e| {
            logging::log_error(&format!("Connection failed: {}", e));
            e.to_string()
        })
    }

    pub fn disconnect_hub(&self, hub_address: String) -> Result<(), String> {
        logging::log_info(&format!("Disconnecting from hub: {}", hub_address));
        services::disconnect_from_remote_hub(&hub_address).map_err(|e| {
            logging::log_error(&format!("Disconnection failed: {}", e));
            e.to_string()
        })
    }
}

#[near_bindgen]
impl Network for NetworkContract {
    fn get_all_settings(&self) -> Vec<String> {
        logging::log_info("Fetching all settings");
        self.settings.iter()
            .map(|(k, v)| format!("{}: {}", k, v))
            .collect()
    }

    fn get_setting_by_id(&self, id: String) -> Option<String> {
        logging::log_info(&format!("Fetching setting by id: {}", id));
        self.settings.get(&id).map(|v| format!("{}: {}", id, v))
    }

    fn create_setting(&mut self, setting: String) {
        logging::log_info(&format!("Creating setting: {}", setting));
        let parts: Vec<&str> = setting.split(':').collect();
        if parts.len() != 2 {
            env::panic_str(&ContractError::InvalidInput("Invalid setting format".to_string()).to_string());
        }
        self.settings.insert(parts[0].trim().to_string(), parts[1].trim().to_string());
    }

    fn update_setting(&mut self, id: String, setting: String) {
        logging::log_info(&format!("Updating setting: {}", setting));
        if let Some(entry) = self.settings.get_mut(&id) {
            *entry = setting;
        } else {
            env::panic_str(&ContractError::NotFound("Setting not found".to_string()).to_string());
        }
    }

    fn delete_setting(&mut self, id: String) {
        logging::log_info(&format!("Deleting setting: {}", id));
        self.settings.remove(&id).expect(&ContractError::NotFound("Setting not found".to_string()).to_string());
    }
}