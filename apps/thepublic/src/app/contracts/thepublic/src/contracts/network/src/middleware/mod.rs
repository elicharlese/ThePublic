// middleware/mod.rs

use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct NetworkSetting {
    pub setting_name: String,
    pub value: String,
    pub description: Option<String>,
}

#[derive(Debug)]
pub struct ValidationError {
    pub messages: Vec<String>,
}

impl ValidationError {
    pub fn new() -> Self {
        Self { messages: Vec::new() }
    }

    pub fn add_message(&mut self, message: String) {
        self.messages.push(message);
    }

    pub fn is_empty(&self) -> bool {
        self.messages.is_empty()
    }
}

pub fn validate_network_setting(setting: &NetworkSetting) -> Result<(), ValidationError> {
    let mut errors = ValidationError::new();

    if setting.setting_name.is_empty() {
        errors.add_message("Setting name is required".to_string());
    }

    if setting.value.is_empty() {
        errors.add_message("Value is required".to_string());
    }

    if errors.is_empty() {
        Ok(())
    } else {
        Err(errors)
    }
}

#[derive(Debug, Clone)]
pub struct User {
    pub is_authenticated: bool,
    pub permissions: Vec<String>,
}

impl User {
    pub fn has_permission(&self, permission: &str) -> bool {
        self.permissions.contains(&permission.to_string())
    }
}

pub fn is_authenticated(user: &Option<User>) -> Result<(), String> {
    if let Some(user) = user {
        if user.is_authenticated {
            return Ok(());
        }
    }
    Err("Unauthorized".to_string())
}

pub fn check_permissions(user: &Option<User>, permission: &str) -> Result<(), String> {
    if let Some(user) = user {
        if user.has_permission(permission) {
            return Ok(());
        }
    }
    Err("Forbidden".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_network_setting() {
        let valid_setting = NetworkSetting {
            setting_name: "ValidName".to_string(),
            value: "ValidValue".to_string(),
            description: None,
        };

        let invalid_setting_name = NetworkSetting {
            setting_name: "".to_string(),
            value: "ValidValue".to_string(),
            description: None,
        };

        let invalid_value = NetworkSetting {
            setting_name: "ValidName".to_string(),
            value: "".to_string(),
            description: None,
        };

        let invalid_both = NetworkSetting {
            setting_name: "".to_string(),
            value: "".to_string(),
            description: None,
        };

        // Test valid setting
        assert!(validate_network_setting(&valid_setting).is_ok());

        // Test invalid setting name
        match validate_network_setting(&invalid_setting_name) {
            Ok(_) => panic!("Expected validation error but got Ok"),
            Err(errors) => {
                assert!(errors.messages.contains(&"Setting name is required".to_string()));
            }
        }

        // Test invalid value
        match validate_network_setting(&invalid_value) {
            Ok(_) => panic!("Expected validation error but got Ok"),
            Err(errors) => {
                assert!(errors.messages.contains(&"Value is required".to_string()));
            }
        }

        // Test invalid both
        match validate_network_setting(&invalid_both) {
            Ok(_) => panic!("Expected validation error but got Ok"),
            Err(errors) => {
                assert!(errors.messages.contains(&"Setting name is required".to_string()));
                assert!(errors.messages.contains(&"Value is required".to_string()));
            }
        }
    }

    #[test]
    fn test_is_authenticated() {
        let user = Some(User {
            is_authenticated: true,
            permissions: vec![],
        });
        assert!(is_authenticated(&user).is_ok());

        let user = Some(User {
            is_authenticated: false,
            permissions: vec![],
        });
        assert!(is_authenticated(&user).is_err());

        assert!(is_authenticated(&None).is_err());
    }

    #[test]
    fn test_check_permissions() {
        let user = Some(User {
            is_authenticated: true,
            permissions: vec!["admin".to_string()],
        });
        assert!(check_permissions(&user, "admin").is_ok());
        assert!(check_permissions(&user, "user").is_err());

        let user = Some(User {
            is_authenticated: true,
            permissions: vec![],
        });
        assert!(check_permissions(&user, "admin").is_err());

        assert!(check_permissions(&None, "admin").is_err());
    }
}