// libraries/logging.rs

use near_sdk::env;

pub fn log_info(message: &str) {
    env::log_str(&format!("INFO: {}", message));
}

pub fn log_error(message: &str) {
    env::log_str(&format!("ERROR: {}", message));
}