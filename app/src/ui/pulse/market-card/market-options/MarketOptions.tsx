import { Button } from "ui/button/Button";
import pulse from "providers/pulse";
import { Typography } from "ui/typography/Typography";

import styles from "./MarketOptions.module.scss";
import { MarketOptionsProps } from "./MarketOptions.types";

export const MarketOptions = ({
  marketContractValues: { market, isResolved, outcomeTokens },
  onClickOutcomeToken,
}: MarketOptionsProps) => (
  <>
    {market.options.map((option, id) => {
      if (!isResolved && outcomeTokens?.length === 0) {
        return (
          <Button
            color="secondary"
            fullWidth
            className={styles["market-options__actions-button"]}
            key={option}
            disabled
          >
            <span
              className={styles["market-options__actions-button-dot"]}
              style={{ backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id] }}
            />{" "}
            <Typography.Text flat truncate inline>
              {option}
            </Typography.Text>{" "}
            <span className={styles["market-options__actions-button-percentage"]}>
              {Number(100 / market.options.length)
                .toFixed(2)
                .toString()}
              %
            </span>
          </Button>
        );
      }

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
          className={styles["market-options__actions-button"]}
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
