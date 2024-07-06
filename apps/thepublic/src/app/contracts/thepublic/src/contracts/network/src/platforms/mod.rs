// platforms/mod.rs

#[cfg(target_os = "unix")]
mod unix;
#[cfg(target_os = "windows")]
mod windows;

#[cfg(target_os = "unix")]
pub use unix::*;
#[cfg(target_os = "windows")]
pub use windows::*;

// Common interface for network management functionalities
pub trait NetworkManager {
    fn get_all_network_settings() -> Result<String, String>;
    fn get_network_setting_by_id(id: &str) -> Result<String, String>;
    fn create_network_setting(setting_name: &str, value: &str) -> Result<String, String>;
    fn update_network_setting(id: &str, prop: &str, value: &str) -> Result<String, String>;
    fn delete_network_setting(id: &str) -> Result<String, String>;
}