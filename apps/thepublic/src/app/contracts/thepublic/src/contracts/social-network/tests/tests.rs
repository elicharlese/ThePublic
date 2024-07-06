#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    fn get_context(is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "bob.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "bob.testnet".to_string(),
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
        let mut contract = SocialNetwork::new();
        contract.send_message("bob.testnet".to_string(), "Hello, Bob!".to_string());
        let messages = contract.get_messages("bob.testnet".to_string());
        assert_eq!(messages.len(), 1);
        assert_eq!(messages[0].content, "Hello, Bob!");
    }

    #[test]
    fn test_add_tag() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = SocialNetwork::new();
        contract.add_tag("alice.testnet".to_string(), "developer".to_string());
        let tagged_accounts = contract.get_tagged_accounts("developer".to_string());
        assert_eq!(tagged_accounts.len(), 1);
        assert_eq!(tagged_accounts[0], "alice.testnet".to_string());
    }

    #[test]
    fn test_add_bookmark() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = SocialNetwork::new();
        contract.add_bookmark("content_1".to_string(), "Title 1".to_string(), "http://example.com".to_string());
        let bookmarks = contract.get_bookmarks("alice.testnet".to_string());
        assert_eq!(bookmarks.len(), 1);
        assert_eq!(bookmarks[0].title, "Title 1");
    }

    #[test]
    fn test_create_collection() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = SocialNetwork::new();
        contract.create_collection("MyCollection".to_string());
        let collections = contract.get_collections("alice.testnet".to_string());
        assert_eq!(collections.len(), 1);
        assert_eq!(collections[0].name, "MyCollection");
    }

    #[test]
    fn test_add_bookmark_to_collection() {
        let context = get_context(false);
        testing_env!(context);
        let mut contract = SocialNetwork::new();
        let bookmark = Bookmark {
            content_id: "content_1".to_string(),
            title: "Title 1".to_string(),
            url: "http://example.com".to_string(),
            timestamp: 1234567890,
        };
        contract.create_collection("MyCollection".to_string());
        contract.add_bookmark_to_collection("MyCollection".to_string(), bookmark.clone());
        let collections = contract.get_collections("alice.testnet".to_string());
        assert_eq!(collections.len(), 1);
        assert_eq!(collections[0].name, "MyCollection".to_string());
        assert_eq!(collections[0].bookmarks.len(), 1);
        assert_eq!(collections[0].bookmarks[0].title, "Title 1");
    }
}