import { CollateralTokenMetadata, Fees, Management, MarketData, Pricing, Resolution } from "../market/market.types";

export type DeployMarketContractArgs = {
  market: MarketData;
  resolution: Resolution;
  management: Management;
  collateral_token: CollateralTokenMetadata;
  fees: Fees;
  price?: Pricing;
};

export type MarketFactoryContractValues = {
  marketsCount: number;
};

export type MarketFactoryContractMethods = {
  get_markets_list: () => Promise<Array<string>>;
  get_markets_count: () => Promise<number>;
  get_markets: () => Promise<Array<string>>;
  create_market: (args: { name: string; args: string }, gas?: number, amount?: string | null) => Promise<boolean>;
};
