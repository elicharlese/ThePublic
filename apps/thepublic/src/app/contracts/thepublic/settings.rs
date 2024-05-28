use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId};
use std::collections::HashMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct NetworkSettings {
    ssid: String,
    password: String,
    ip_address: Option<String>,
    subnet_mask: Option<String>,
    default_gateway: Option<String>,
    dns_servers: Option<Vec<String>>,
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct SettingsContract {
    user_settings: HashMap<AccountId, NetworkSettings>,
}

#[near_bindgen]
impl SettingsContract {
    // Adds or updates network settings for a user
    pub fn set_network_settings(
        &mut self,
        account_id: AccountId,
        ssid: String,
        password: String,
        ip_address: Option<String>,
        subnet_mask: Option<String>,
        default_gateway: Option<String>,
        dns_servers: Option<Vec<String>>,
    ) {
        let settings = NetworkSettings {
            ssid,
            password,
            ip_address,
            subnet_mask,
            default_gateway,
            dns_servers,
        };

        self.user_settings.insert(account_id, settings);
        env::log_str("Network settings updated successfully");
    }

    // Retrieves network settings for a user
    pub fn get_network_settings(&self, account_id: AccountId) -> Option<NetworkSettings> {
        self.user_settings.get(&account_id).cloned()
    }

    // Updates specific fields of network settings for a user
    pub fn update_network_settings(
        &mut self,
        account_id: AccountId,
        ssid: Option<String>,
        password: Option<String>,
        ip_address: Option<String>,
        subnet_mask: Option<String>,
        default_gateway: Option<String>,
        dns_servers: Option<Vec<String>>,
    ) {
        if let Some(settings) = self.user_settings.get_mut(&account_id) {
            if let Some(ssid) = ssid {
                settings.ssid = ssid;
            }
            if let Some(password) = password {
                settings.password = password;
            }
            if let Some(ip_address) = ip_address {
                settings.ip_address = Some(ip_address);
            }
            if let Some(subnet_mask) = subnet_mask {
                settings.subnet_mask = Some(subnet_mask);
            }
            if let Some(default_gateway) = default_gateway {
                settings.default_gateway = Some(default_gateway);
            }
            if let Some(dns_servers) = dns_servers {
                settings.dns_servers = Some(dns_servers);
            }
            env::log_str("Network settings updated successfully");
        }
    }
}