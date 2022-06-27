import { PropertyOwner, PropertyContentMedia, PropertyPrice } from "api/codegen";

export type PropertyMetadata = {
  id: string;
  title: string;
  price: PropertyPrice;
  shortDescription: string;
  longDescription: string;
  category: string;
  expirationDate: string;
  media: PropertyContentMedia;
  owner: PropertyOwner;
};

export type ConditionalEscrowValues = {
  totalFunds: string;
  fundingAmountLimit: string;
  unpaidFundingAmount: string;
  totalFundedPercentage: number;
  currentCoinPrice: number;
  priceEquivalence: number;
  expirationDate: number;
  daoFactoryAccountId: string;
  ftFactoryAccountId: string;
  daoName: string;
  metadataURL: string;
  isDepositAllowed: boolean;
  isWithdrawalAllowed: boolean;
  deposits: string[][];
  depositsOf: string;
  depositsOfPercentage: number;
};

export type ConditionalEscrowMethods = {
  get_total_funds: () => Promise<number>;
  get_funding_amount_limit: () => Promise<number>;
  get_unpaid_funding_amount: () => Promise<number>;
  get_deposits: () => Promise<string[][]>;
  get_expiration_date: () => Promise<number>;
  get_dao_factory_account_id: () => Promise<string>;
  get_ft_factory_account_id: () => Promise<string>;
  get_dao_name: () => Promise<string>;
  get_metadata_url: () => Promise<string>;
  is_deposit_allowed: () => Promise<boolean>;
  is_withdrawal_allowed: () => Promise<boolean>;
  deposits_of: ({ payee }: { payee: string }) => Promise<number>;
  deposit: (args: Record<string, string>, gas?: number, amount?: string | null) => Promise<void>;
  withdraw: () => Promise<void>;
  delegate_funds: ({ dao_name }: { dao_name: string }, gas: string | number) => Promise<boolean>;
};
