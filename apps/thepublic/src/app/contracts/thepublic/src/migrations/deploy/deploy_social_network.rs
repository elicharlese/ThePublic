// migrations/deploy/deploy_social_network.rs

use near_sdk_sim::UserAccount;
use migrations::utils::{init_root, deploy_contract};

fn main() {
    let root = init_root();
    let social_network_contract = deploy_contract::<SocialNetworkContract>("social_network", &root, "../res/social_network_contract.wasm");

    // Edge case handling and settings (e.g., initial configurations, admin setting)
    root.call(
        social_network_contract.user_account.account_id(), 
        "initialize", 
        &serde_json::json!({"admin": root.account_id()}).to_string().into_bytes(), 
        near_sdk_sim::to_yocto("1"), 
        near_sdk_sim::DEFAULT_GAS
    ).assert_success();
}