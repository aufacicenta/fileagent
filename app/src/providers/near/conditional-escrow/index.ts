import { Contract } from "near-api-js";
import * as nearAPI from "near-api-js";
import { Property } from "api/codegen";
import ipfs from "providers/ipfs";
import currency from "providers/currency";
import { WalletSelectorContextType } from "context/wallet-selector/WalletSelectorContext.types";

import date from "providers/date";
import nearUtils from "providers/near";
import getCoinCurrentPrice from "providers/currency/getCoinCurrentPrice";
import { DEFAULT_NETWORK_ENV } from "../getConfig";
import formatFiatCurrency from "providers/currency/formatFiatCurrency";

import { ConditionalEscrowMethods, ConditionalEscrowValues, PropertyMetadata } from "./conditional-escrow.types";
import { VIEW_METHODS } from "./constants";

export class ConditionalEscrow {
  values: ConditionalEscrowValues | undefined;

  contract: Contract & ConditionalEscrowMethods;

  contractAddress: string;

  constructor(contract: Contract & ConditionalEscrowMethods) {
    this.contract = contract;
    this.contractAddress = contract.contractId;
  }

  static getDefaultContractValues = (): ConditionalEscrowValues => ({
    totalFunds: "0",
    fundingAmountLimit: nearUtils.formatAccountBalance("0"),
    unpaidFundingAmount: nearUtils.formatAccountBalance("0"),
    depositsOf: "0",
    depositsOfPercentage: 0,
    currentCoinPrice: 0,
    priceEquivalence: 0,
    totalFundedPercentage: 0,
    expirationDate: date.toNanoseconds(date.now().toDate().getTime()),
    daoFactoryAccountId: "",
    ftFactoryAccountId: "",
    daoName: "",
    metadataURL: "",
    isDepositAllowed: false,
    isWithdrawalAllowed: false,
    deposits: [],
  });

  static async getCurrentPriceEquivalence(price: number = 0): Promise<{ price: number; equivalence: number }> {
    const currentCoinPrice = await currency.getCoinCurrentPrice("near", currency.constants.DEFAULT_VS_CURRENCY);

    return { price: currentCoinPrice, equivalence: currentCoinPrice * price };
  }

  static async getPropertyFromMetadataUrl(url: string): Promise<PropertyMetadata> {
    const response = await fetch(ipfs.asHttpsURL(url), {
      method: "GET",
    });

    const data = await response.json();

    return data;
  }

  static async getFromConnection(contractAddress: string) {
    const near = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      // @TODO DEFAULT_NETWORK_ENV should be dynamic from client headers: testnet or mainnet
      ...nearUtils.getConfig(DEFAULT_NETWORK_ENV),
    });

    const account = await near.account(nearUtils.getConfig(DEFAULT_NETWORK_ENV).guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: [] };

    return nearUtils.initContract<ConditionalEscrowMethods>(account, contractAddress, contractMethods);
  }

  static async getPropertyCard(contractAddress: string): Promise<Property | null> {
    const contract = await ConditionalEscrow.getFromConnection(contractAddress);

    const conditionalEscrow = new ConditionalEscrow(contract);
    const metadataUrl = await conditionalEscrow.getMetadataUrl();

    const propertyMetadata = await ConditionalEscrow.getPropertyFromMetadataUrl(metadataUrl);

    if (!propertyMetadata.price) {
      return null;
    }

    const { price, equivalence } = await ConditionalEscrow.getCurrentPriceEquivalence(propertyMetadata.price.value);
    const fundedPercentageResponse = await conditionalEscrow.getTotalFundedPercentage();

    return {
      ...propertyMetadata,
      contract: {
        id: contractAddress,
      },
      price: {
        value: propertyMetadata.price.value || 0,
        fundedPercentage: fundedPercentageResponse.toString(),
        exchangeRate: {
          price: formatFiatCurrency(price),
          currencySymbol: currency.constants.DEFAULT_VS_CURRENCY,
          equivalence: formatFiatCurrency(equivalence),
        },
      },
    };
  }

  async getMetadataUrl(): Promise<string> {
    const metadataURL = await this.contract.get_metadata_url();

    return metadataURL;
  }

  async getTotalFundedPercentage(): Promise<bigint> {
    return (BigInt(await this.getTotalFunds()) * BigInt(100)) / BigInt(await this.getFundingAmountLimit());
  }

  async getTotalFunds(): Promise<number> {
    const response = await this.contract.get_total_funds();

    return response;
  }

  async getFundingAmountLimit(): Promise<number> {
    const response = await this.contract.get_funding_amount_limit();

    return response;
  }

  async delegateFunds(args: { dao_name: string }, gas: string | number): Promise<boolean> {
    const response = await this.contract.delegate_funds(args, gas);

    return response;
  }

  async withdraw(): Promise<void> {
    const response = await this.contract.withdraw();

    return response;
  }

  async deposit(args: Record<string, string>, gas?: number, amount?: string | null): Promise<void> {
    const response = await this.contract.deposit(args, gas, amount);

    return response;
  }

  async setConstantValues(wallet: WalletSelectorContextType) {
    const getTotalFundsResponse = await this.getTotalFunds();
    const getFundingAmountLimitResponse = await this.getFundingAmountLimit();
    const totalFundedPercentage = await this.getTotalFundedPercentage();

    const getUnpaidFundingAmountResponse = await this.contract.get_unpaid_funding_amount();

    const isDepositAllowed = await this.contract.is_deposit_allowed();
    const isWithdrawalAllowed = await this.contract.is_withdrawal_allowed();

    const deposits = await this.contract.get_deposits();
    const expirationDate = await this.contract.get_expiration_date();
    const depositsOfResponse = await this.contract.deposits_of({
      payee: wallet.address ?? wallet.context.guest.address,
    });
    const depositsOfPercentage = (BigInt(depositsOfResponse) * BigInt(100)) / BigInt(getFundingAmountLimitResponse);

    const currentCoinPrice = await getCoinCurrentPrice("near", "usd");
    const { equivalence: priceEquivalence } = await ConditionalEscrow.getCurrentPriceEquivalence(
      Number(nearUtils.formatAccountBalanceFlat(BigInt(getFundingAmountLimitResponse).toString()).replace(",", "")),
    );

    const daoFactoryAccountId = await this.contract.get_dao_factory_account_id();
    const ftFactoryAccountId = await this.contract.get_ft_factory_account_id();
    const daoName = await this.contract.get_dao_name();
    const metadataURL = await this.contract.get_metadata_url();

    this.values = {
      totalFunds: BigInt(getTotalFundsResponse).toString(),
      fundingAmountLimit: nearUtils.formatAccountBalance(BigInt(getFundingAmountLimitResponse).toString(), 8),
      unpaidFundingAmount: nearUtils.formatAccountBalance(BigInt(getUnpaidFundingAmountResponse).toString(), 8),
      depositsOf: BigInt(depositsOfResponse).toString(),
      totalFundedPercentage: Number(totalFundedPercentage),
      depositsOfPercentage: Number(depositsOfPercentage),
      currentCoinPrice,
      priceEquivalence,
      deposits,
      expirationDate,
      isDepositAllowed,
      isWithdrawalAllowed,
      daoFactoryAccountId,
      ftFactoryAccountId,
      daoName,
      metadataURL,
    };
  }
}
