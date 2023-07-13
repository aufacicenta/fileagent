use near_sdk::near_bindgen;

use crate::storage::*;

#[near_bindgen]
impl Market {
    pub fn is_resolved(&self) -> bool {
        let is_resolved_at_set = match self.resolution.resolved_at {
            Some(_) => true,
            None => false,
        };

        let is_resolution_result_set = match self.resolution.result {
            Some(_) => true,
            None => false,
        };

        is_resolved_at_set && is_resolution_result_set
    }

    pub fn is_open(&self) -> bool {
        self.get_block_timestamp() <= self.market.ends_at
    }

    pub fn is_over(&self) -> bool {
        self.get_block_timestamp() > self.market.ends_at
    }

    pub fn is_reveal_window_expired(&self) -> bool {
        self.get_block_timestamp() > self.resolution.reveal_window
    }

    pub fn is_self_destruct_window_expired(&self) -> bool {
        self.get_block_timestamp() > self.management.self_destruct_window
    }

    pub fn is_resolution_window_expired(&self) -> bool {
        self.get_block_timestamp() > self.resolution.window
    }

    pub fn is_expired_unresolved(&self) -> bool {
        self.is_resolution_window_expired() && !self.is_resolved()
    }
}
