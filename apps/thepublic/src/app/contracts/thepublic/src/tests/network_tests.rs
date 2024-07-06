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
    fn test_create_setting() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = NetworkContract::new("owner.testnet".to_string());
        contract.create_setting("max_connections:100".to_string());
        let setting = contract.get_setting_by_id("max_connections".to_string());
        assert_eq!(setting.unwrap(), "max_connections: 100");
    }

    #[test]
    fn test_delete_setting() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = NetworkContract::new("owner.testnet".to_string());
        contract.create_setting("max_connections:100".to_string());
        contract.delete_setting("max_connections".to_string());
        let setting = contract.get_setting_by_id("max_connections".to_string());
        assert!(setting.is_none());
    }
}