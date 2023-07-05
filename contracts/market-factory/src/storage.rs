use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::Vector,
    near_bindgen, AccountId,
};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct MarketFactory {
    pub markets: Vector<AccountId>,
}
