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
    fn test_send_message() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = SocialNetworkContract::new();
        contract.send_message("bob.testnet".to_string(), "Hello, Bob!".to_string());
        let messages = contract.get_messages("bob.testnet".to_string());
        assert_eq!(messages.len(), 1);
        assert!(messages[0].contains("Hello, Bob!"));
    }

    #[test]
    fn test_add_and_get_tagged_accounts() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = SocialNetworkContract::new();
        contract.add_tag("alice.testnet".to_string(), "developer".to_string());
        let tagged_accounts = contract.get_tagged_accounts("developer".to_string());
        assert_eq!(tagged_accounts.len(), 1);
        assert_eq!(tagged_accounts[0], "alice.testnet".to_string());
    }
}