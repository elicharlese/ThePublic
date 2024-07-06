// platforms/windows.rs

use std::process::Command;
use std::str;

pub struct WindowsNetworkManager;

impl super::NetworkManager for WindowsNetworkManager {
    fn get_all_network_settings() -> Result<String, String> {
        execute_command("netsh interface show interface")
    }

    fn get_network_setting_by_id(id: &str) -> Result<String, String> {
        execute_command(&format!("netsh interface ipv4 show address {}", id))
    }

    fn create_network_setting(setting_name: &str, value: &str) -> Result<String, String> {
        // Implement according to the specific command required for adding network settings
        Err("Function not implemented for Windows".to_string())
    }

    fn update_network_setting(id: &str, prop: &str, value: &str) -> Result<String, String> {
        execute_command(&format!("netsh interface ipv4 set address {} {} {}", id, prop, value))
    }

    fn delete_network_setting(id: &str) -> Result<String, String> {
        execute_command(&format!("netsh interface delete interface {}", id))
    }
}

fn execute_command(command: &str) -> Result<String, String> {
    match Command::new("cmd").args(&["/C", command]).output() {
        Ok(output) => {
            if output.status.success() {
                Ok(str::from_utf8(&output.stdout).unwrap_or("").to_string())
            } else {
                Err(str::from_utf8(&output.stderr).unwrap_or("Unknown Error").to_string())
            }
        }
        Err(_) => Err("Failed to execute command".to_string()),
    }
}