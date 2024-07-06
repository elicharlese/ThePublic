#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    fn get_context(is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "tester.testnet".to_string(),
            signer_account_id: "tester.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "tester.testnet".to_string(),
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 0,
        }
    }

    #[test]
    fn test_register_user() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = UserManagementContract::new();
        contract.register_user("alice".to_string(), "bio".to_string(), "alice@test.com".to_string());
        let profile = contract.get_user_profile("tester.testnet".to_string()).unwrap();
        assert!(profile.contains("alice"));
    }

    #[test]
    fn test_authenticate_user() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = UserManagementContract::new();
        contract.register_user("alice".to_string(), "bio".to_string(), "alice@test.com".to_string());
        contract.authenticate_user();
        let profile = contract.get_user_profile("tester.testnet".to_string()).unwrap();
        assert!(profile.contains("true")); // Check for authenticated true
    }
}