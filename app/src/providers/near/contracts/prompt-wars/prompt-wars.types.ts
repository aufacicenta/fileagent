type Timestamp = number;
type WrappedBalance = number;
export type AccountId = string;
export type OutcomeId = AccountId;
export type OutcomeTokenResult = number;

export type Prompt = {
  value: string;
  negative_prompt?: string;
};

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
  self_destruct_window: Timestamp;
  buy_sell_threshold: number;
  market_creator_account_id?: AccountId;
};

export type CollateralToken = {
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

export type OutcomeToken = {
  outcome_id: OutcomeId;
  prompt: string;
  total_supply: WrappedBalance;
  result?: OutcomeTokenResult;
};

export type PromptWarsMarketContractValues = {
  market: MarketData;
  resolution: Resolution;
  fees: Fees;
  management: Management;
  collateralToken: CollateralToken;
  outcomeIds: Array<OutcomeId>;
  isResolved: boolean;
  isOpen: boolean;
  isOver: boolean;
  isRevealWindowExpired: boolean;
  isResolutionWindowExpired: boolean;
  isExpiredUnresolved: boolean;
  isClaimingWindowExpired: boolean;

  status: PromptWarsMarketContractStatus;
};

export enum PromptWarsMarketContractStatus {
  LOADING = "Loading",
  OPEN = "Open",
  REVEALING = "Revealing",
  RESOLVING = "Resolving",
  RESOLVED = "Resolved",
  UNRESOLVED = "Unresolved",
  CLOSED = "Closed",
}

export type GetOutcomeTokenArgs = {
  outcome_id: OutcomeId;
};

export type PromptWarsMarketContractMethods = {
  get_market_data: () => Promise<MarketData>;
  get_resolution_data: () => Promise<Resolution>;
  get_fee_data: () => Promise<Fees>;
  get_management_data: () => Promise<Management>;
  get_collateral_token_metadata: () => Promise<CollateralToken>;
  get_outcome_token: (args: GetOutcomeTokenArgs) => Promise<OutcomeToken>;
  get_outcome_ids: () => Promise<Array<AccountId>>;
  get_block_timestamp: () => Promise<Timestamp>;
  resolved_at: () => Promise<Timestamp>;
  balance_of: (outcome_id: OutcomeId) => Promise<WrappedBalance>;
  get_amount_mintable: (amount: WrappedBalance) => Promise<Array<WrappedBalance>>;
  get_amount_payable_unresolved: () => Promise<Array<WrappedBalance>>;
  get_amount_payable_resolved: () => Promise<Array<WrappedBalance>>;
  get_precision_decimals: () => Promise<WrappedBalance>;
  // flags
  is_resolved: () => Promise<boolean>;
  is_open: () => Promise<boolean>;
  is_over: () => Promise<boolean>;
  is_reveal_window_expired: () => Promise<boolean>;
  is_resolution_window_expired: () => Promise<boolean>;
  is_expired_unresolved: () => Promise<boolean>;
  is_claiming_window_expired: () => Promise<boolean>;
  // mutators
  sell: (args: { name: string; args: string }, gas?: number, amount?: string | null) => Promise<boolean>;
  reveal: (
    args: { outcome_id: OutcomeId; result: OutcomeTokenResult },
    gas?: number,
    amount?: string | null,
  ) => Promise<boolean>;
  resolve: (args: { name: string; args: string }, gas?: number, amount?: string | null) => Promise<boolean>;
};
