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

    // Test the creation of network settings
    #[test]
    fn test_create_network_setting() {
        let mut controller = Controllers::new();
        let setting = NetworkSetting {
            setting_name: "TestSetting".to_string(),
            value: "TestValue".to_string(),
            description: None,
        };
        assert_eq!(controller.create_network_setting(setting.clone()), Ok(()));
        let fetched_setting = controller.get_network_setting_by_id("TestSetting").unwrap();
        assert_eq!(fetched_setting.setting_name, "TestSetting");
    }

    // Test retrieving all network settings
    #[test]
    fn test_get_all_network_settings() {
        let mut controller = Controllers::new();
        let setting1 = NetworkSetting {
            setting_name: "Setting1".to_string(),
            value: "Value1".to_string(),
            description: None,
        };
        let setting2 = NetworkSetting {
            setting_name: "Setting2".to_string(),
            value: "Value2".to_string(),
            description: None,
        };
        controller.create_network_setting(setting1.clone()).unwrap();
        controller.create_network_setting(setting2.clone()).unwrap();
        let settings = controller.get_all_network_settings();
        assert_eq!(settings.len(), 2);
    }

    // Test updating a network setting
    #[test]
    fn test_update_network_setting() {
        let mut controller = Controllers::new();
        let setting = NetworkSetting {
            setting_name: "TestSetting".to_string(),
            value: "TestValue".to_string(),
            description: None,
        };
        controller.create_network_setting(setting.clone()).unwrap();
        let updated_setting = NetworkSetting {
            setting_name: "TestSetting".to_string(),
            value: "UpdatedValue".to_string(),
            description: None,
        };
        assert_eq!(controller.update_network_setting("TestSetting", updated_setting.clone()), Ok(()));
        let fetched_setting = controller.get_network_setting_by_id("TestSetting").unwrap();
        assert_eq!(fetched_setting.value, "UpdatedValue");
    }

    // Test deleting a network setting
    #[test]
    fn test_delete_network_setting() {
        let mut controller = Controllers::new();
        let setting = NetworkSetting {
            setting_name: "TestSetting".to_string(),
            value: "TestValue".to_string(),
            description: None,
        };
        controller.create_network_setting(setting.clone()).unwrap();
        assert_eq!(controller.delete_network_setting("TestSetting"), Ok(()));
        assert!(controller.get_network_setting_by_id("TestSetting").is_none());
    }

    // Test platform-specific network manager for Unix
    #[cfg(target_os = "unix")]
    #[test]
    fn test_network_manager_unix() {
        let controller = Controllers::new();
        assert_eq!(controller.network_manager, "Handling network connections for Unix");
    }

    // Test platform-specific network manager for Windows
    #[cfg(target_os = "windows")]
    #[test]
    fn test_network_manager_windows() {
        let controller = Controllers::new();
        assert_eq!(controller.network_manager, "Handling network connections for Windows");
    }

    // Test middleware: validate_request
    #[test]
    fn test_validate_request() {
        use crate::middleware::validate_request;
        let valid_setting = NetworkSetting {
            setting_name: "ValidName".to_string(),
            value: "ValidValue".to_string(),
            description: None,
        };
        let invalid_setting = NetworkSetting {
            setting_name: "".to_string(),
            value: "".to_string(),
            description: None,
        };
        assert!(validate_request(&valid_setting).is_ok());
        assert!(validate_request(&invalid_setting).is_err());
    }

    // Test middleware: is_authenticated
    #[test]
    fn test_is_authenticated() {
        use crate::middleware::is_authenticated;
        let user = Some(crate::middleware::User {
            is_authenticated: true,
            permissions: vec![],
        });
        assert!(is_authenticated(&user).is_ok());

        let user = Some(crate::middleware::User {
            is_authenticated: false,
            permissions: vec![],
        });
        assert!(is_authenticated(&user).is_err());

        assert!(is_authenticated(&None).is_err());
    }

    // Test middleware: check_permissions
    #[test]
    fn test_check_permissions() {
        use crate::middleware::check_permissions;
        let user = Some(crate::middleware::User {
            is_authenticated: true,
            permissions: vec!["admin".to_string()],
        });
        assert!(check_permissions(&user, "admin").is_ok());
        assert!(check_permissions(&user, "user").is_err());

        let user = Some(crate::middleware::User {
            is_authenticated: true,
            permissions: vec![],
        });
        assert!(check_permissions(&user, "admin").is_err());

        assert!(check_permissions(&None, "admin").is_err());
    }
}