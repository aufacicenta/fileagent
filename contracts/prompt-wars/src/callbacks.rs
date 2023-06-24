use near_sdk::{env, log, near_bindgen, PromiseResult};
use num_format::ToFormattedString;
use shared::OutcomeId;

use crate::{storage::*, FORMATTED_STRING_LOCALE};

#[near_bindgen]
impl Market {
    #[private]
    pub fn on_ft_transfer_callback(
        &mut self,
        amount_payable: WrappedBalance,
        outcome_id: OutcomeId,
    ) -> String {
        match env::promise_result(0) {
            PromiseResult::Successful(_result) => {
                log!(
                    "on_ft_transfer_callback.amount_payable: {}",
                    amount_payable.to_formatted_string(&FORMATTED_STRING_LOCALE)
                );

                self.update_collateral_token_balance(
                    self.collateral_token.balance - amount_payable,
                );

                let mut outcome_token = self.get_outcome_token(&outcome_id);
                outcome_token.burn();

                self.outcome_tokens.insert(&outcome_id, &outcome_token);

                return amount_payable.to_string();
            }
            _ => env::panic_str("ERR_ON_FT_TRANSFER_CALLBACK"),
        }
    }
}
