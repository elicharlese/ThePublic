// libraries/utils.rs

use near_sdk::env;

pub fn get_current_account_id() -> String {
    env::current_account_id().to_string()
}

pub fn get_block_timestamp() -> u64 {
    env::block_timestamp()
}