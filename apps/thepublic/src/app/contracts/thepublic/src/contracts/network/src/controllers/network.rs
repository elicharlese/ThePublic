// controllers/network.rs

#[cfg(target_os = "windows")]
pub fn get_network_manager() -> String {
    "Handling network connections for Windows".to_string()
}

#[cfg(target_os = "unix")]
pub fn get_network_manager() -> String {
    "Handling network connections for Unix".to_string()
}