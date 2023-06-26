type Timestamp = number;
type WrappedBalance = number;
type AccountId = string;

export type ResolutionResult = AccountId;

export type MarketData = {
  image_uri: string;
  starts_at: Timestamp;
  ends_at: Timestamp;
};

export type Fees = {
  price: WrappedBalance;
  fee_ratio: WrappedBalance;
  claiming_window?: Timestamp;
};

export type Management = {
  dao_account_id: AccountId;
  market_creator_account_id?: AccountId;
  self_destruct_window: Timestamp;
  buy_sell_threshold: number;
};

export type CollateralTokenMetadata = {
  id: string;
  balance: number;
  decimals: number;
  fee_balance: WrappedBalance;
};

export type Resolution = {
  window: Timestamp;
  reveal_window: Timestamp;
  resolved_at?: Timestamp;
  result?: string;
};
