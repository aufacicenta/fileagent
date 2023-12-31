import clsx from "clsx";

import { Button } from "ui/button/Button";
import pulse from "providers/pulse";
import { Typography } from "ui/typography/Typography";
import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";

import styles from "./MarketOptions.module.scss";
import { MarketOptionsProps } from "./MarketOptions.types";

export const MarketOptions = ({ marketContractValues: { market, isResolved, outcomeTokens } }: MarketOptionsProps) => {
  const { onClickOutcomeToken } = useNearMarketContractContext();

  return (
    <>
      {market.options.map((option, id) => {
        const outcomeToken = outcomeTokens![id];
        const totalSupply = outcomeTokens?.reduce<number>((prev, current) => prev + current.total_supply, 0);
        const weight =
          totalSupply === 0
            ? Number(100 / market.options.length)
                .toFixed(2)
                .toString()
            : ((outcomeToken.total_supply / totalSupply!) * 100).toFixed(2).toString();

        return (
          <Button
            color="secondary"
            fullWidth
            className={clsx(styles["market-options__actions-button"], {
              [styles["market-options__actions-button--winner"]]: isResolved && outcomeToken.is_active,
            })}
            key={option}
            onClick={() => onClickOutcomeToken(outcomeToken)}
          >
            <span
              className={styles["market-options__actions-button-dot"]}
              style={{ backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id] }}
            />{" "}
            <Typography.Text flat truncate inline>
              {option}
            </Typography.Text>{" "}
            <span className={styles["market-options__actions-button-percentage"]}>{weight}%</span>
          </Button>
        );
      })}
    </>
  );
};
