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
    fn test_record_data() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = AnalyticsContract::new();
        contract.record_data("login".to_string(), "User logged in".to_string());
        let analytics = contract.get_analytics("login".to_string());
        assert_eq!(analytics.len(), 1);
        assert!(analytics[0].contains("User logged in"));
    }

    #[test]
    fn test_get_analytics_no_data() {
        let context = get_context(false);
        testing_env!(context);
        let contract = AnalyticsContract::new();
        let analytics = contract.get_analytics("nonexistent".to_string());
        assert_eq!(analytics.len(), 0);
    }

    #[test]
    fn test_get_analytics() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = AnalyticsContract::new();
        contract.record_data("purchase".to_string(), "Item bought".to_string());
        contract.record_data("purchase".to_string(), "Another item bought".to_string());
        let analytics = contract.get_analytics("purchase".to_string());
        assert_eq!(analytics.len(), 2);
        assert!(analytics[0].contains("Item bought"));
        assert!(analytics[1].contains("Another item bought"));
    }
}