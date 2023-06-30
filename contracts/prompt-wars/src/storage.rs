use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::{LookupMap, Vector},
    near_bindgen,
    serde::{Deserialize, Serialize},
    AccountId, BorshStorageKey,
};
use shared::OutcomeId;

pub type Timestamp = i64;
pub type WrappedBalance = u128;
pub type OutcomeTokenResult = f32;
pub type ResolutionResult = OutcomeId;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[cfg_attr(not(target_arch = "wasm32"), derive(Debug, PartialEq))]
#[serde(crate = "near_sdk::serde")]
pub struct MarketData {
    // The IPFS reference-image hash of the expected prompts
    pub image_uri: String,
    // Datetime nanos: the market is open
    pub starts_at: Timestamp,
    // Datetime nanos: the market is closed
    pub ends_at: Timestamp,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Market {
    // Market metadata
    pub market: MarketData,
    // NEP141 token metadata
    pub collateral_token: CollateralToken,
    // MArket resolution metadata
    pub resolution: Resolution,
    // Market management account ids metadata
    pub management: Management,
    // Keeps track of Outcomes prices and balances
    pub outcome_tokens: LookupMap<AccountId, OutcomeToken>,
    // Keeps track of the outcome_ids that have bet on the market
    pub players: Vector<AccountId>,
    // Market fees metadata
    pub fees: Fees,
}

#[derive(Serialize, Deserialize)]
pub enum SetPriceOptions {
    Increase,
    Decrease,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize)]
pub struct OutcomeToken {
    // the account id of the outcome_token
    pub outcome_id: OutcomeId,
    // the outcome value, in this case, the prompt submitted to the competition
    pub prompt: String,
    // the outcome value, in this case, the prompt submitted to the competition
    pub output_img_uri: Option<String>,
    // store the result from the image comparison: percentage_diff or pixel_difference
    pub result: Option<OutcomeTokenResult>,
    // total supply of this outcome_token
    pub total_supply: WrappedBalance,
}

#[derive(BorshSerialize, BorshDeserialize, Deserialize, Serialize, Clone)]
pub struct CollateralToken {
    pub id: AccountId,
    pub balance: WrappedBalance,
    pub decimals: u8,
    pub fee_balance: WrappedBalance,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
pub struct Resolution {
    // Time to free up the market
    pub window: Timestamp,
    // Time after the market ends and before the resolution window starts
    pub reveal_window: Timestamp,
    // When the market is resolved, set only by fn resolve
    pub resolved_at: Option<Timestamp>,
    // When the market is resolved, set only by fn resolve
    pub result: Option<ResolutionResult>,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
pub struct Management {
    // Gets sent fees when claiming window is open
    pub dao_account_id: AccountId,
    // Gets back the storage deposit upon self-destruction
    pub market_creator_account_id: AccountId,
    // Set at initialization, the market may be destroyed by the creator to claim the storage deposit
    pub self_destruct_window: Timestamp,
    // Set at initialization, determines when to close bets
    pub buy_sell_threshold: f32,
}

#[derive(BorshSerialize, BorshDeserialize, Deserialize, Serialize, Clone)]
pub struct Fees {
    // Price to charge when creating an outcome token
    pub price: WrappedBalance,
    // Decimal fee to charge upon a bet
    pub fee_ratio: WrappedBalance,
}

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    OutcomeTokens,
    StakingFees,
    MarketCreatorFees,
}

#[derive(Serialize, Deserialize)]
pub struct CreateOutcomeTokenArgs {
    // the outcome value, in this case, the prompt submitted to the competition
    pub prompt: String,
}

#[derive(Serialize, Deserialize)]
pub enum Payload {
    CreateOutcomeTokenArgs(CreateOutcomeTokenArgs),
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
pub struct Ix {
    pub address: [u8; 32],
}
