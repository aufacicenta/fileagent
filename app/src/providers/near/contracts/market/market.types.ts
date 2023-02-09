import { Gas } from "providers/near/types";

export type OutcomeId = number;
export type WrappedBalance = number;
export type AccountId = string;
export type Timestamp = number;

export type MarketData = {
  description: string;
  info: string;
  category: string;
  options: Array<string>;
  starts_at: Timestamp;
  ends_at: Timestamp;
  utc_offset: number;
};

export type Pricing = {
  value: number;
  base_currency_symbol: string;
  target_currency_symbol: string;
};

export type Fees = {
  fee_ratio: number;
  claiming_window?: Timestamp;
};

export type Management = {
  dao_account_id: AccountId;
  staking_token_account_id?: AccountId;
  market_creator_account_id?: AccountId;
};

export type CollateralTokenMetadata = {
  id: string;
  balance: number;
  decimals: number;
  fee_balance: WrappedBalance;
};

export type Resolution = {
  window: Timestamp;
  ix: Ix;
  resolved_at?: Timestamp;
  feed_id?: string;
};

export type Ix = {
  address: Array<number>;
};

export type OutcomeToken = {
  accounts_length: number;
  total_supply: WrappedBalance;
  outcome_id: OutcomeId;
  is_active: boolean;
  balance_of?: WrappedBalance;
  value?: string | number;
  position?: number;
};

export type MarketContractValues = {
  market: MarketData;
  resolutionWindow?: Timestamp;
  buySellTimestamp?: Timestamp;
  isOver: boolean;
  isOpen: boolean;
  isResolutionWindowExpired: boolean;
  isResolved: boolean;
  collateralTokenMetadata: CollateralTokenMetadata;
  feeRatio: WrappedBalance;
  resolution: Resolution;
  outcomeTokens?: Array<OutcomeToken>;
  price?: Pricing;
};

export type GetOutcomeTokenArgs = { outcome_id: OutcomeId };
export type BalanceOfArgs = { outcome_id: OutcomeId; account_id: AccountId };
export type GetAmountMintableArgs = { amount: WrappedBalance };
export type GetAmountPayableArgs = { outcome_id: OutcomeId; amount: WrappedBalance };
export type SellArgs = { outcome_id: OutcomeId; amount: WrappedBalance };

export type MarketContractMethods = {
  get_market_data: () => Promise<MarketData>;
  get_pricing_data: () => Promise<Pricing | null>;
  get_resolution_data: () => Promise<Resolution>;
  get_fee_ratio: () => Promise<number>;
  get_outcome_token: (args: GetOutcomeTokenArgs) => Promise<OutcomeToken>;
  get_outcome_ids: () => Promise<Array<number>>;
  get_block_timestamp: () => Promise<Timestamp>;
  get_collateral_token_metadata: () => Promise<CollateralTokenMetadata>;
  get_market_creator_account_id: () => Promise<AccountId>;
  dao_account_id: () => Promise<AccountId>;
  resolution_window: () => Promise<Timestamp>;
  resolved_at: () => Promise<Timestamp>;
  is_resolved: () => Promise<boolean>;
  get_buy_sell_timestamp: () => Promise<Timestamp>;
  is_open: () => Promise<boolean>;
  is_closed: () => Promise<boolean>;
  is_over: () => Promise<boolean>;
  is_resolution_window_expired: () => Promise<boolean>;
  balance_of: (args: BalanceOfArgs) => Promise<WrappedBalance>;
  get_amount_mintable: (args: GetAmountMintableArgs) => Promise<Array<number>>;
  get_amount_payable: (args: GetAmountPayableArgs) => Promise<Array<number>>;
  sell: (args: SellArgs, gas?: Gas) => Promise<void>;
  aggregator_read: () => Promise<void>;
};
