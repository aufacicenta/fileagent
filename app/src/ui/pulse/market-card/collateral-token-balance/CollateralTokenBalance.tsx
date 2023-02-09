import { useEffect, useState } from "react";

import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";
import pulse from "providers/pulse";

import { CollateralTokenBalanceProps } from "./CollateralTokenBalance.types";

export const CollateralTokenBalance: React.FC<CollateralTokenBalanceProps> = ({
  collateralTokenMetadata,
  marketId,
}) => {
  const [balance, setBalance] = useState("0.00");

  const FungibleTokenContract = useNearFungibleTokenContract({ contractAddress: collateralTokenMetadata.id });
  const ftMetadata = FungibleTokenContract.metadata;

  useEffect(() => {
    (async () => {
      const collateralTokenBalance = await FungibleTokenContract.getBalanceOf(marketId);
      setBalance(collateralTokenBalance);
    })();
  }, [
    collateralTokenMetadata.id,
    marketId,
    ftMetadata?.decimals,
    FungibleTokenContract.actions.ftTransferCall.isLoading,
  ]);

  const collateralToken = pulse.getCollateralTokenByAccountId(collateralTokenMetadata.id);

  if (!collateralToken) {
    return <>0.00</>;
  }

  return (
    <>
      {balance} {collateralToken.symbol}
    </>
  );
};
