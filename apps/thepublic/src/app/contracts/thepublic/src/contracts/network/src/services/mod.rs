// services/mod.rs

use std::collections::HashMap;
use near_sdk::json_types::U128;

#[derive(Debug)]
pub enum NetworkError {
    ScanFailed,
    ConnectionFailed,
    DisconnectionFailed,
    InvalidTarget,
}

impl std::fmt::Display for NetworkError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

pub fn start_nmap_scan(target: &str) -> Result<HashMap<String, String>, NetworkError> {
    // More robust scan logic with edge case handling in Rust
    let mut response = HashMap::new();
    if target.is_empty() {
        return Err(NetworkError::InvalidTarget);
    }
    // Simulate making a request to start a scan
    if target.contains("network") {
        response.insert("status".to_string(), "success".to_string());
        response.insert("output".to_string(), format!("Scan results for {}", target));
        Ok(response)
    } else {
        Err(NetworkError::ScanFailed)
    }
}

pub fn connect_to_remote_hub(hub_address: &str) -> Result<(), NetworkError> {
    // Example logic to connect to a remote hub with edge case handling
    if hub_address.is_empty() {
        return Err(NetworkError::ConnectionFailed);
    }
    if hub_address == "valid_hub_address" {
        Ok(())
    } else {
        Err(NetworkError::ConnectionFailed)
    }
}

pub fn disconnect_from_remote_hub(hub_address: &str) -> Result<(), NetworkError> {
    // Example logic to disconnect from a remote hub with edge case handling
    if hub_address.is_empty() {
        return Err(NetworkError::DisconnectionFailed);
    }
    if hub_address == "valid_hub_address" {
        Ok(())
    } else {
        Err(NetworkError::DisconnectionFailed)
    }
}

// Adding tests for these services
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_start_nmap_scan() {
        let response = start_nmap_scan("network_1").unwrap();
        assert_eq!(response.get("status").unwrap(), "success");

        let response = start_nmap_scan("").err().unwrap();
        assert_eq!(response.to_string(), "InvalidTarget");

        let response = start_nmap_scan("invalid_target").err().unwrap();
        assert_eq!(response.to_string(), "ScanFailed");
    }

    #[test]
    fn test_connect_to_remote_hub() {
        assert!(connect_to_remote_hub("valid_hub_address").is_ok());
        assert!(connect_to_remote_hub("").is_err());
        assert!(connect_to_remote_hub("invalid_hub_address").is_err());
    }

    #[test]
    fn test_disconnect_from_remote_hub() {
        assert!(disconnect_from_remote_hub("valid_hub_address").is_ok());
        assert!(disconnect_from_remote_hub("").is_err());
        assert!(disconnect_from_remote_hub("invalid_hub_address").is_err());
    }
}