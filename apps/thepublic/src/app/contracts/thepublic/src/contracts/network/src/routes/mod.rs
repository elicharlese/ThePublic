// routes/mod.rs

use crate::controllers;
use crate::middleware;
use crate::services::{analytics, network_settings};

pub fn route_request(request: &str, data: Option<String>) -> String {
    if middleware::validate_request(request) {
        middleware::log_request(request);

        match request {
            "collect" => {
                if let Some(data) = data {
                    return analytics::collect_data(&data);
                } else {
                    return "No data provided".to_string();
                }
            }
            "results" => {
                return analytics::get_analytics().map_or_else(
                    || "Error fetching analytics".to_string(),
                    |result| result
                );
            }
            // Network Settings Routes
            "network_settings_get_all" => {
                return network_settings::get_all_settings().map_or_else(
                    || "Failed to fetch network settings".to_string(),
                    |settings| settings
                );
            }
            "network_settings_get_by_id" => {
                if let Some(id) = data {
                    return network_settings::get_setting_by_id(&id).map_or_else(
                        || "Failed to fetch network setting".to_string(),
                        |setting| setting
                    );
                } else {
                    return "No ID provided".to_string();
                }
            }
            "network_settings_create" => {
                if let Some(setting_json) = data {
                    return network_settings::create_new_setting(&setting_json).map_or_else(
                        || "Failed to create network setting".to_string(),
                        |setting| setting
                    );
                } else {
                    return "No data provided".to_string();
                }
            }
            "network_settings_update" => {
                if let Some(setting_json) = data {
                    return network_settings::update_setting(&setting_json).map_or_else(
                        || "Failed to update network setting".to_string(),
                        |setting| setting
                    );
                } else {
                    return "No data provided".to_string();
                }
            }
            "network_settings_delete" => {
                if let Some(id) = data {
                    return network_settings::delete_setting(&id).map_or_else(
                        || "Failed to delete network setting".to_string(),
                        || "Network setting deleted successfully".to_string()
                    );
                } else {
                    return "No ID provided".to_string();
                }
            }
            _ => return "Unknown request".to_string(),
        }
    } else {
        "Invalid request".to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_route_request() {
        // Test analytics routes
        assert_eq!(route_request("collect", Some("sample data".to_string())), "Data collected successfully");
        assert_eq!(route_request("results", None), "Analytics results");

        // Test network settings routes
        assert_eq!(route_request("network_settings_get_all", None), "Fetched all network settings successfully");
        assert_eq!(route_request("network_settings_get_by_id", Some("1".to_string())), "Fetched network setting successfully");
        assert_eq!(route_request("network_settings_create", Some("{\"settingName\":\"example\",\"value\":\"value\"}".to_string())), "Network setting created successfully");
        assert_eq!(route_request("network_settings_update", Some("{\"id\":\"1\",\"settingName\":\"example\",\"value\":\"new_value\"}".to_string())), "Network setting updated successfully");
        assert_eq!(route_request("network_settings_delete", Some("1".to_string())), "Network setting deleted successfully");
    }
}