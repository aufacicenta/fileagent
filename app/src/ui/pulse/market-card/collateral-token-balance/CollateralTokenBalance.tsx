import { useEffect, useState } from "react";

import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";
import pulse from "providers/pulse";

import { CollateralTokenBalanceProps } from "./CollateralTokenBalance.types";

export const CollateralTokenBalance: React.FC<CollateralTokenBalanceProps> = ({ collateralTokenMetadata }) => {
  const [balance, setBalance] = useState("0.00");

  const FungibleTokenContract = useNearFungibleTokenContract();

  useEffect(() => {
    (async () => {
      const collateralTokenBalance = await FungibleTokenContract.getWalletBalance(collateralTokenMetadata.id);
      setBalance(collateralTokenBalance);
    })();
  }, [FungibleTokenContract, collateralTokenMetadata.id]);

  return (
    <>
      {balance} {pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id).symbol}
    </>
  );
};
