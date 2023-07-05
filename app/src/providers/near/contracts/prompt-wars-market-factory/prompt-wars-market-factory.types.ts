import { CollateralToken, Management, MarketData } from "../prompt-wars/prompt-wars.types";

export type DeployPromptWarsMarketContractArgs = {
  market: MarketData;
  management: Management;
  collateral_token: CollateralToken;
};

export type PromptWarsMarketFactoryContractValues = {
  marketsCount: number;
};

export type PromptWarsMarketFactoryContractMethods = {
  get_markets_list: () => Promise<Array<string>>;
  get_markets_count: () => Promise<number>;
  get_markets: () => Promise<Array<string>>;
  create_market: (args: { name: string; args: string }, gas?: number, amount?: string | null) => Promise<boolean>;
};
