// platforms/unix.rs

use std::process::Command;
use std::str;

pub struct UnixNetworkManager;

impl super::NetworkManager for UnixNetworkManager {
    fn get_all_network_settings() -> Result<String, String> {
        execute_command("nmcli device show")
    }

    fn get_network_setting_by_id(id: &str) -> Result<String, String> {
        execute_command(&format!("nmcli device show {}", id))
    }

    fn create_network_setting(setting_name: &str, value: &str) -> Result<String, String> {
        execute_command(&format!("nmcli con add type {} {}", setting_name, value))
    }

    fn update_network_setting(id: &str, prop: &str, value: &str) -> Result<String, String> {
        execute_command(&format!("nmcli con mod {} {} {}", id, prop, value))
    }

    fn delete_network_setting(id: &str) -> Result<String, String> {
        execute_command(&format!("nmcli con delete {}", id))
    }
}

fn execute_command(command: &str) -> Result<String, String> {
    match Command::new("sh").arg("-c").arg(command).output() {
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