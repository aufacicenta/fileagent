import near from "providers/near";

import getConfig from "./getConfig";
import * as constants from "./constants";

const isMainnet = () => near.getConfig().networkId !== "testnet";

const getCollateralTokenBySymbol = (symbol: string) =>
  getConfig().COLLATERAL_TOKENS.filter((token) => token.symbol === symbol)[0];

const getCollateralTokenByAccountId = (accountId: string) =>
  getConfig().COLLATERAL_TOKENS.filter((token) => token.accountId === accountId)[0];

const getCollateralTokenIconByAccountId = (accountId: string) => getCollateralTokenByAccountId(accountId).icon;

export default {
  getConfig,
  getCollateralTokenBySymbol,
  getCollateralTokenByAccountId,
  getCollateralTokenIconByAccountId,
  constants,
  isMainnet,
};
