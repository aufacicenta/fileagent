use near_sdk::near_bindgen;

use crate::storage::*;

#[near_bindgen]
impl Market {
    pub fn is_resolved(&self) -> bool {
        match self.resolution.resolved_at {
            Some(_) => true,
            None => false,
        }
    }

    pub fn is_open(&self) -> bool {
        let limit = self.get_buy_sell_timestamp();

        self.get_block_timestamp() <= limit
    }

    pub fn is_over(&self) -> bool {
        self.get_block_timestamp() > self.market.ends_at
    }

    pub fn is_reveal_window_expired(&self) -> bool {
        self.get_block_timestamp() > self.resolution.reveal_window
    }

    pub fn is_resolution_window_expired(&self) -> bool {
        self.get_block_timestamp() > self.resolution.window
    }

    pub fn is_expired_unresolved(&self) -> bool {
        self.is_resolution_window_expired() && !self.is_resolved()
    }

    pub fn is_claiming_window_expired(&self) -> bool {
        self.get_block_timestamp() > self.management.self_destruct_window
    }
}
