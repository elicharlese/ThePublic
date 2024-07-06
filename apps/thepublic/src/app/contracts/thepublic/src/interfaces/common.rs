// interfaces/common.rs

pub trait Common {
    fn get_account_id(&self) -> String;
    fn get_block_timestamp(&self) -> u64;
}