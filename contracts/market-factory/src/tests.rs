#[cfg(test)]
mod tests {
    use crate::consts::STORAGE_DEPOSIT_BOND;
    use crate::storage::MarketFactory;
    use chrono::{Duration, Utc};
    use near_sdk::test_utils::test_env::alice;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::PromiseResult;
    use near_sdk::{serde_json::json, testing_env, AccountId};

    const IX_ADDRESS: [u8; 32] = [
        173, 62, 255, 125, 45, 251, 162, 167, 128, 129, 25, 33, 146, 248, 118, 134, 118, 192, 215,
        84, 225, 222, 198, 48, 70, 49, 212, 195, 84, 136, 96, 56,
    ];

    fn setup_context() -> VMContextBuilder {
        let mut context = VMContextBuilder::new();
        let now = Utc::now().timestamp_subsec_nanos();
        testing_env!(context
            .predecessor_account_id(alice())
            .block_timestamp(now.try_into().unwrap())
            .attached_deposit(STORAGE_DEPOSIT_BOND * 2)
            .build());

        context
    }

    fn setup_contract() -> MarketFactory {
        let contract = MarketFactory::new();
        contract
    }

    fn date(date: chrono::DateTime<chrono::Utc>) -> i64 {
        date.timestamp_nanos().try_into().unwrap()
    }

    #[test]
    fn create_market() {
        let mut context = setup_context();

        let now = Utc::now();
        let starts_at = now + Duration::hours(1);
        let ends_at = starts_at + Duration::hours(1);

        let mut contract = setup_contract();

        let name = "480c9dbe-a5ec".to_string();
        let dao_account_id = AccountId::new_unchecked("dao-account-id.near".to_string());
        let market_creator_account_id =
            AccountId::new_unchecked("market-creator-account-id.near".to_string());
        let collateral_token_account_id =
            AccountId::new_unchecked("collateral-token-account-id.near".to_string());

        let args = json!({
            "market": {
                "description": "description",
                "info": "info",
                "options": vec!["option_1", "option_2"],
                "starts_at": date(starts_at).to_string(),
                "ends_at": date(ends_at).to_string(),
                "utc_offset": 0,
            },
            "resolution": {
                "window": date(now).to_string(),
                "ix": {
                    "address": IX_ADDRESS.to_vec()
                },
            },
            "management": {
                "dao_account_id": dao_account_id,
                "market_creator_account_id": market_creator_account_id,
            },
            "collateral_token": {
                "id": collateral_token_account_id,
                "balance": 0,
                "decimals": 6,
                "fee_balance": 0,
            },
            "fees": {
                "fee_ratio": 20_000,
            },
        });

        contract.create_market(
            name.clone().try_into().unwrap(),
            args.to_string().into_bytes().to_vec().into(),
        );

        let current_account_id = AccountId::new_unchecked("contract".to_string());

        testing_env!(context
            .current_account_id(current_account_id.clone())
            .attached_deposit(STORAGE_DEPOSIT_BOND * 2)
            .build());

        let market_account_id: AccountId =
            format!("{}.{}", name.clone(), current_account_id.clone())
                .parse()
                .unwrap();

        testing_env!(
            context.build(),
            near_sdk::VMConfig::test(),
            near_sdk::RuntimeFeesConfig::test(),
            Default::default(),
            vec![PromiseResult::Successful(vec![])],
        );

        contract.on_create_market_callback(market_account_id.clone(), collateral_token_account_id);

        contract.on_ft_storage_deposit_callback(market_account_id.clone());

        assert_eq!(contract.markets.len(), 1);
        assert_eq!(contract.get_markets_list(), vec![market_account_id.clone()]);
        assert_eq!(contract.get_markets_count(), 1);
        assert_eq!(contract.get_markets(0, 1), vec![market_account_id.clone()]);
    }
}
