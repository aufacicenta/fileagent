#[cfg(test)]
mod tests {
    use crate::{storage::*, FungibleTokenReceiver, CREATE_OUTCOME_TOKEN_PRICE};
    use chrono::{Duration, Utc};
    use near_sdk::json_types::U128;
    use near_sdk::serde_json::json;
    use near_sdk::test_utils::test_env::{alice, bob, carol};
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{serde_json, testing_env, AccountId, Balance, PromiseResult};
    use rand::seq::SliceRandom;

    const _ATTACHED_DEPOSIT: Balance = 1_000_000_000_000_000_000_000_000; // 1 Near

    fn daniel() -> AccountId {
        AccountId::new_unchecked("daniel.near".to_string())
    }

    fn emily() -> AccountId {
        AccountId::new_unchecked("emily.near".to_string())
    }

    fn frank() -> AccountId {
        AccountId::new_unchecked("frank.near".to_string())
    }

    fn gus() -> AccountId {
        AccountId::new_unchecked("gus.near".to_string())
    }

    fn dao_account_id() -> AccountId {
        AccountId::new_unchecked("dao_account_id.near".to_string())
    }

    fn collateral_token_id() -> AccountId {
        AccountId::new_unchecked("collateral_token_id.near".to_string())
    }

    fn market_creator_account_id() -> AccountId {
        AccountId::new_unchecked("market_creator_account_id.near".to_string())
    }

    fn date(date: chrono::DateTime<chrono::Utc>) -> i64 {
        date.timestamp_nanos().try_into().unwrap()
    }

    fn block_timestamp(date: chrono::DateTime<chrono::Utc>) -> u64 {
        date.timestamp_nanos().try_into().unwrap()
    }

    fn setup_context() -> VMContextBuilder {
        let mut context = VMContextBuilder::new();
        let now = Utc::now().timestamp_subsec_nanos();
        testing_env!(context
            .predecessor_account_id(alice())
            .block_timestamp(now.try_into().unwrap())
            .build());

        context
    }

    fn setup_contract(market: MarketData, res: Option<Resolution>) -> Market {
        let mut resolution = Resolution {
            // add 5 minutes
            reveal_window: market.ends_at + 300_000,
            // add 5 minutes
            window: market.ends_at + 300_000 + 300_000,
            resolved_at: None,
        };

        if let Some(res) = res {
            resolution.window = res.window;
        }

        let management = Management {
            dao_account_id: dao_account_id(),
            market_creator_account_id: market_creator_account_id(),
            self_destruct_window: 0,
            buy_sell_threshold: 0.0,
        };

        let collateral_token = CollateralToken {
            id: collateral_token_id(),
            balance: 0,
            decimals: 6,
            fee_balance: 0,
        };

        let contract = Market::new(market, management, collateral_token);

        contract
    }

    fn create_outcome_token(
        c: &mut Market,
        sender_id: AccountId,
        amount: WrappedBalance,
        payload: CreateOutcomeTokenArgs,
    ) {
        c.ft_on_transfer(
            sender_id,
            U128::from(amount),
            json!({ "CreateOutcomeTokenArgs": { "prompt": payload.prompt } }).to_string(),
        );
    }

    fn create_market_data(starts_at: i64, ends_at: i64) -> MarketData {
        MarketData {
            image_uri: "abcxyz".to_string(),
            starts_at,
            ends_at,
        }
    }

    #[test]
    fn should_create_outcome_token_for_players() {
        let mut context = setup_context();

        let now = Utc::now();
        testing_env!(context.block_timestamp(block_timestamp(now)).build());
        let starts_at = now + Duration::hours(1);
        let ends_at = starts_at + Duration::hours(1);

        let market_data: MarketData = create_market_data(date(starts_at), date(ends_at));
        let mut contract: Market = setup_contract(market_data, None);

        let amount = CREATE_OUTCOME_TOKEN_PRICE;
        let prompt =
            json!({ "value": "a prompt", "negative_prompt": "a negative prompt" }).to_string();

        let player_1 = alice();

        create_outcome_token(
            &mut contract,
            player_1.clone(),
            amount,
            CreateOutcomeTokenArgs {
                prompt: prompt.clone(),
            },
        );

        let outcome_token_1: OutcomeToken = contract.get_outcome_token(player_1.clone());

        assert_eq!(
            outcome_token_1.total_supply(),
            contract.collateral_token.balance
        );

        assert_eq!(
            outcome_token_1.get_balance_of(),
            contract.collateral_token.balance
        );

        assert_eq!(outcome_token_1.outcome_id(), player_1.clone());

        assert_eq!(
            contract.balance_of(player_1.clone()),
            contract.collateral_token.balance
        );

        assert_eq!(outcome_token_1.get_prompt(), prompt);

        let player_2 = bob();

        create_outcome_token(
            &mut contract,
            player_2.clone(),
            amount,
            CreateOutcomeTokenArgs {
                prompt: prompt.clone(),
            },
        );

        let outcome_token_2: OutcomeToken = contract.get_outcome_token(player_2.clone());

        assert_eq!(
            outcome_token_2.total_supply(),
            contract.collateral_token.balance - outcome_token_1.total_supply()
        );

        assert_eq!(
            outcome_token_2.get_balance_of(),
            contract.collateral_token.balance - outcome_token_1.total_supply()
        );

        assert_eq!(outcome_token_2.outcome_id(), player_2.clone());

        assert_eq!(
            contract.balance_of(player_2.clone()),
            contract.collateral_token.balance - outcome_token_1.total_supply()
        );

        assert_eq!(outcome_token_2.get_prompt(), prompt);
    }

    #[test]
    #[should_panic(expected = "ERR_MARKET_IS_CLOSED")]
    fn should_fail_on_create_outcome_token_for_player_after_threshold() {}

    #[test]
    #[should_panic(expected = "ERR_MARKET_RESOLVED")]
    fn should_fail_on_create_outcome_token_for_player_when_resolved() {}

    #[test]
    #[should_panic(expected = "ERR_ASSERT_PRICE_TOO_LOW")]
    fn should_fail_on_create_outcome_token_for_player_when_amount_lt_price() {}

    #[test]
    #[should_panic(expected = "ERR_SET_RESULT_ALREADY_SET")]
    fn should_fail_on_reveal_set_result() {}
}
