mod libraries;
mod interfaces;
mod types;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, PanicOnDefault};
use std::collections::HashMap;
use crate::interfaces::Analytics;
use crate::libraries::{logging, utils};
use crate::types::EventData;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct AnalyticsContract {
    data: HashMap<String, Vec<EventData>>,
}

#[near_bindgen]
impl Analytics for AnalyticsContract {
    fn record_data(&mut self, event_type: String, data: String) {
        logging::log_info(&format!("Recording data for event type: {}", event_type));
        let event_data = EventData {
            event_type: event_type.clone(),
            data,
            timestamp: env::block_timestamp(),
        };
        self.data.entry(event_type).or_insert_with(Vec::new).push(event_data);
    }

    fn get_analytics(&self, event_type: String) -> Vec<String> {
        logging::log_info(&format!("Fetching analytics for event type: {}", event_type));
        self.data.get(&event_type)
            .map(|events| {
                events.iter()
                    .map(|event| format!("{}: {} at {}", event.event_type, event.data, event.timestamp))
                    .collect()
            })
            .unwrap_or_default()
    }
}

#[near_bindgen]
impl AnalyticsContract {
    #[init]
    pub fn new() -> Self {
        logging::log_info("Initializing AnalyticsContract");
        Self {
            data: HashMap::new(),
        }
    }
}