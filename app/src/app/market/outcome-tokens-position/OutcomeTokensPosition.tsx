import clsx from "clsx";
import { useEffect, useState } from "react";

import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { OutcomeToken } from "providers/near/contracts/market/market.types";
import { Typography } from "ui/typography/Typography";
import { Card } from "ui/card/Card";
import currency from "providers/currency";

import styles from "./OutcomeTokensPosition.module.scss";
import { OutcomeTokensPositionProps } from "./OutcomeTokensPosition.types";

export const OutcomeTokensPosition: React.FC<OutcomeTokensPositionProps> = ({ className }) => {
  const [balances, setBalances] = useState<OutcomeToken[]>();

  const walletState = useWalletStateContext();

  const { marketContractValues, getBalanceOf } = useNearMarketContractContext();

  useEffect(() => {
    if (!marketContractValues?.outcomeTokens || !walletState.isConnected) {
      return;
    }

    (async () => {
      const promises = marketContractValues.outcomeTokens!.map((token) =>
        getBalanceOf({ outcome_id: token.outcome_id, account_id: walletState.address! }).then((balance_of) => ({
          ...token,
          balance_of,
          value: marketContractValues.market.options[token.outcome_id],
          position: token.total_supply === 0 ? 0 : (balance_of / token.total_supply) * 100,
        })),
      );

      const result = await Promise.all(promises);

      setBalances(result);
    })();
  }, [marketContractValues]);

  return (
    <Card className={clsx(styles["outcome-tokens-position__card"], className)}>
      <Card.Content className={styles["outcome-tokens-position__card--content"]}>
        <Typography.MiniDescription align="right">Your position</Typography.MiniDescription>
        {balances?.length ? (
          <>
            {balances?.map((token) => (
              <div className={styles["outcome-tokens-position__row"]} key={token.outcome_id}>
                <Typography.Description flat className={styles["outcome-tokens-position__col"]}>
                  {token.value}
                </Typography.Description>
                <Typography.Description flat className={styles["outcome-tokens-position__col"]}>
                  {currency.convert.fromUIntAmount(
                    token.balance_of!,
                    marketContractValues?.collateralTokenMetadata.decimals!,
                  )}
                </Typography.Description>
                <Typography.Description flat className={styles["outcome-tokens-position__col"]}>
                  {token.position?.toFixed(2)}%
                </Typography.Description>
              </div>
            ))}
          </>
        ) : (
          <Typography.MiniDescription>Connect wallet to load balances</Typography.MiniDescription>
        )}
      </Card.Content>
    </Card>
  );
};
