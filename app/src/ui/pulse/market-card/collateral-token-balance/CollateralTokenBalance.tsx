import { useEffect } from "react";

import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";
import pulse from "providers/pulse";

import { CollateralTokenBalanceProps } from "./CollateralTokenBalance.types";

export const CollateralTokenBalance: React.FC<CollateralTokenBalanceProps> = ({ contractAddress, accountId }) => {
  const { getBalanceOf, balanceOf } = useNearFungibleTokenContract({
    contractAddress,
  });

  useEffect(() => {
    if (!accountId) {
      return;
    }

    getBalanceOf(accountId);
  }, [accountId, contractAddress]);

  const collateralToken = pulse.getCollateralTokenByAccountId(contractAddress);

  return (
    <>
      {collateralToken.symbol} {balanceOf}
    </>
  );
};
