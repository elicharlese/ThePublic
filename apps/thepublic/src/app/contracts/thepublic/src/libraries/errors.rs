// libraries/errors.rs

#[derive(Debug)]
pub enum ContractError {
    NotFound(String),
    Unauthorized(String),
    InvalidInput(String),
}

impl ContractError {
    pub fn to_string(&self) -> String {
        match self {
            ContractError::NotFound(msg) => format!("Not Found: {}", msg),
            ContractError::Unauthorized(msg) => format!("Unauthorized: {}", msg),
            ContractError::InvalidInput(msg) => format!("Invalid Input: {}", msg),
        }
    }
}