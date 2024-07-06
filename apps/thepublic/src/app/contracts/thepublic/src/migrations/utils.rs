// migrations/utils.rs

use near_sdk_sim::{deploy, init_simulator, ContractAccount, UserAccount};
use std::path::Path;

pub fn init_root() -> UserAccount {
    init_simulator(None)
}

pub fn deploy_contract<T>(
    contract_id: &str, 
    root: &UserAccount, 
    wasm_path: &str
) -> ContractAccount<T> {
    assert!(Path::new(wasm_path).exists(), "Contract WASM file does not exist");
    let bytes = std::fs::read(wasm_path).expect("Failed to read contract WASM file");
    deploy!(
        contract: T,
        contract_id: contract_id.to_string(),
        bytes: &bytes,
        signer_account: root
    )
}

pub fn migrate_state(
    root: &UserAccount, 
    old_contract_id: &str, 
    new_contract_id: &str
) {
    // Note: This is a simplified example; actual migration might differ.
    let old_state: Vec<u8> = root.view(
        old_contract_id, 
        "get_state", 
        &serde_json::json!({}).to_string().into_bytes()
    ).unwrap_json();
    
    root.call(
        new_contract_id.to_string(),
        "set_state",
        &old_state,
        near_sdk_sim::to_yocto("1"), 
        near_sdk_sim::DEFAULT_GAS
    ).assert_success();
}