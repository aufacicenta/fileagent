use crate::math;
use near_sdk::{env, log, near_bindgen, AccountId};
use num_format::ToFormattedString;
use shared::OutcomeId;

use crate::{storage::*, FORMATTED_STRING_LOCALE};

#[near_bindgen]
impl Market {
    pub fn get_market_data(&self) -> MarketData {
        self.market.clone()
    }

    pub fn get_resolution_data(&self) -> Resolution {
        self.resolution.clone()
    }

    pub fn get_fee_ratio(&self) -> WrappedBalance {
        self.fees.fee_ratio
    }

    pub fn get_outcome_token(&self, outcome_id: &OutcomeId) -> OutcomeToken {
        match self.outcome_tokens.get(outcome_id) {
            Some(token) => token,
            None => env::panic_str("ERR_INVALID_outcome_id"),
        }
    }

    pub fn get_outcome_ids(&self) -> Vec<AccountId> {
        self.players.to_vec()
    }

    pub fn get_block_timestamp(&self) -> Timestamp {
        env::block_timestamp().try_into().unwrap()
    }

    pub fn get_collateral_token_metadata(&self) -> CollateralToken {
        self.collateral_token.clone()
    }

    pub fn get_market_creator_account_id(&self) -> AccountId {
        self.management.market_creator_account_id.clone()
    }

    pub fn dao_account_id(&self) -> AccountId {
        self.management.dao_account_id.clone()
    }

    pub fn resolution_window(&self) -> Timestamp {
        self.resolution.window
    }

    pub fn resolved_at(&self) -> Timestamp {
        match self.resolution.resolved_at {
            Some(timestamp) => timestamp,
            None => env::panic_str("ERR_RESOLVED_AT"),
        }
    }

    // Players can join the event before N% of the event time has passed
    pub fn get_buy_sell_timestamp(&self) -> i64 {
        let diff = (self.market.ends_at - self.market.starts_at) as f32
            * self.management.buy_sell_threshold;

        self.market.ends_at - diff as i64
    }

    pub fn balance_of(&self, outcome_id: &OutcomeId) -> WrappedBalance {
        self.get_outcome_token(outcome_id).get_balance_of()
    }

    pub fn get_amount_mintable(&self, amount: WrappedBalance) -> (WrappedBalance, WrappedBalance) {
        let fee = self.calc_percentage(amount, self.get_fee_ratio());
        let amount_mintable = amount - fee;

        (amount_mintable, fee)
    }

    // The player gets his deposit back, minus fees
    pub fn get_amount_payable_unresolved(
        &self,
        outcome_id: OutcomeId,
    ) -> (WrappedBalance, WrappedBalance) {
        let amount = self.balance_of(&outcome_id);

        // This balance is already minus fees
        let collateral_token_balance = self.collateral_token.balance;

        let outcome_token_balance = self.balance_of(&outcome_id);

        if amount > outcome_token_balance {
            env::panic_str("ERR_GET_AMOUNT_PAYABLE_UNRESOLVED_INVALID_AMOUNT");
        }

        log!(
            "get_amount_payable_unresolved - EXPIRED_UNRESOLVED -- selling: {}, collateral_token_balance: {}, amount_payable: {}",
            amount.to_formatted_string(&FORMATTED_STRING_LOCALE),
            collateral_token_balance.to_formatted_string(&FORMATTED_STRING_LOCALE),
            amount.to_formatted_string(&FORMATTED_STRING_LOCALE)
        );

        (amount, 0)
    }

    // Winner takes all! This method calculates only after resolution
    pub fn get_amount_payable_resolved(&self) -> (WrappedBalance, WrappedBalance) {
        // This balance is already minus fees
        let collateral_token_balance = self.collateral_token.balance;

        // In this game, winner takes all
        let amount_payable = collateral_token_balance;

        // 100% of the bag baby!
        let weight = 1;

        log!(
            "get_amount_payable - RESOLVED -- ct_balance: {}, weight: {}, amount_payable: {}",
            collateral_token_balance.to_formatted_string(&FORMATTED_STRING_LOCALE),
            weight.to_formatted_string(&FORMATTED_STRING_LOCALE),
            amount_payable.to_formatted_string(&FORMATTED_STRING_LOCALE)
        );

        (amount_payable, weight)
    }

    pub fn get_precision_decimals(&self) -> WrappedBalance {
        let precision = format!(
            "{:0<p$}",
            10,
            p = self.collateral_token.decimals as usize + 1
        );

        precision.parse().unwrap()
    }

    pub fn calc_percentage(&self, amount: WrappedBalance, bps: WrappedBalance) -> WrappedBalance {
        math::complex_div_u128(
            self.get_precision_decimals(),
            math::complex_mul_u128(self.get_precision_decimals(), amount, bps),
            math::complex_mul_u128(1, self.get_precision_decimals(), 100),
        )
    }
}
