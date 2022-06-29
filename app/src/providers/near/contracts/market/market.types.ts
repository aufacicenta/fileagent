export type MarketData = {
  description: string;
  info: string;
  category: string;
  options: Array<string>;
  starts_at: number;
  ends_at: number;
};

export type MarketContractValues = {
  market?: MarketData;
};

export type MarketContractMethods = {
  get_market_data: () => Promise<MarketData>;
};
