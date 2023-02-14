import clsx from "clsx";
import { useEffect } from "react";
import Countdown from "react-countdown";

import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";
import { Typography } from "ui/typography/Typography";
import { CollateralTokenBalance } from "ui/pulse/market-card/collateral-token-balance/CollateralTokenBalance";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import currency from "providers/currency";

import { PriceMarketTableRowProps } from "./PriceMarketTableRow.types";
import styles from "./PriceMarketTableRow.module.scss";

export const PriceMarketTableRow: React.FC<PriceMarketTableRowProps> = ({ className }) => {
  const walletState = useWalletStateContext();

  const {
    fetchMarketContractValues,
    marketContractValues,
    calculateTotalOutcomeTokensPosition,
    outcomeTokensExtended,
    bettingPeriodExpired,
  } = useNearMarketContractContext();

  useEffect(() => {
    fetchMarketContractValues();
  }, []);

  useEffect(() => {
    calculateTotalOutcomeTokensPosition();
  }, [marketContractValues]);

  const getOutcomeTokensPosition = () => {
    if (!walletState.isConnected) {
      return "connect wallet";
    }

    if (outcomeTokensExtended?.length) {
      return outcomeTokensExtended.map((token, index) =>
        index === outcomeTokensExtended.length - 1
          ? `${token.value}: ${currency.convert.fromUIntAmount(
              token.balance_of!,
              marketContractValues?.collateralTokenMetadata.decimals!,
            )} (${token.position?.toFixed(2)}%)`
          : `${token.value}: ${currency.convert.fromUIntAmount(
              token.balance_of!,
              marketContractValues?.collateralTokenMetadata.decimals!,
            )} (${token.position?.toFixed(2)}%), `,
      );
    }

    return "calculating";
  };

  if (!marketContractValues) {
    return null;
  }

  return (
    <tr className={clsx(styles["price-market-table-row"], className)}>
      <td>
        <Typography.Description flat>{marketContractValues.market.description}</Typography.Description>
      </td>
      <td>
        <Typography.Description flat>
          <CollateralTokenBalance />
        </Typography.Description>
      </td>
      <td>
        <Typography.Description flat>{getOutcomeTokensPosition()}</Typography.Description>
      </td>
      <td>
        <Typography.Description flat>
          {!bettingPeriodExpired() ? <Countdown date={marketContractValues.buySellTimestamp} /> : "finalized"}
        </Typography.Description>
      </td>
    </tr>
  );
};
