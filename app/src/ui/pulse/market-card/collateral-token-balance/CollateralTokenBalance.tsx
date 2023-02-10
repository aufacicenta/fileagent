import { useEffect, useState } from "react";

import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";
import pulse from "providers/pulse";

import { CollateralTokenBalanceProps } from "./CollateralTokenBalance.types";

export const CollateralTokenBalance: React.FC<CollateralTokenBalanceProps> = ({
  marketContractValues: { isOver, collateralTokenMetadata },
  marketId,
}) => {
  const [balance, setBalance] = useState("0.00");

  const FungibleTokenContract = useNearFungibleTokenContract({ contractAddress: collateralTokenMetadata.id });
  const ftMetadata = FungibleTokenContract.metadata;

  const updateBalance = async () => {
    const collateralTokenBalance = await FungibleTokenContract.getBalanceOf(marketId);
    setBalance(collateralTokenBalance);
  };

  useEffect(() => {
    updateBalance();

    if (isOver) {
      return undefined;
    }

    const interval = setInterval(() => {
      updateBalance();
    }, 3000);

    if (isOver) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
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
