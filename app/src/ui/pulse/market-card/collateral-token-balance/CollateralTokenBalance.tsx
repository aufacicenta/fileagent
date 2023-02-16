import { useEffect, useState } from "react";

import useNearFungibleTokenContract from "providers/near/contracts/fungible-token/useNearFungibleTokenContract";
import pulse from "providers/pulse";
import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";

import { CollateralTokenBalanceProps } from "./CollateralTokenBalance.types";

export const CollateralTokenBalance: React.FC<CollateralTokenBalanceProps> = () => {
  const [balance, setBalance] = useState("0.00");

  const { marketContractValues, marketId, actions } = useNearMarketContractContext();
  const FungibleTokenContract = useNearFungibleTokenContract({
    contractAddress: marketContractValues?.collateralTokenMetadata.id,
  });

  const ftMetadata = FungibleTokenContract.metadata;

  const updateBalance = async () => {
    const collateralTokenBalance = await FungibleTokenContract.getBalanceOf(marketId);
    setBalance(collateralTokenBalance);
  };

  useEffect(() => {
    if (actions.fetchMarketContractValues.isLoading) {
      return undefined;
    }

    updateBalance();

    if (marketContractValues?.isOver) {
      return undefined;
    }

    const interval = setInterval(() => {
      updateBalance();
    }, 3000);

    if (marketContractValues?.isOver) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    marketContractValues?.collateralTokenMetadata.id,
    marketId,
    ftMetadata?.decimals,
    FungibleTokenContract.actions.ftTransferCall.isLoading,
  ]);

  if (!marketContractValues?.collateralTokenMetadata.id) {
    return <>0.00</>;
  }

  const collateralToken = pulse.getCollateralTokenByAccountId(marketContractValues?.collateralTokenMetadata.id);

  return (
    <>
      {balance} {collateralToken.symbol}
    </>
  );
};
