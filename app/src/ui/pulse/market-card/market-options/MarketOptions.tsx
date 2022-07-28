import { Button } from "ui/button/Button";
import pulse from "providers/pulse";
import { Typography } from "ui/typography/Typography";

import styles from "./MarketOptions.module.scss";
import { MarketOptionsProps } from "./MarketOptions.types";

export const MarketOptions = ({
  marketContractValues: { market, isPublished, outcomeTokens },
  onClickOutcomeToken,
}: MarketOptionsProps) => (
  <>
    {market.options.map((option, id) => {
      if (!isPublished && outcomeTokens?.length === 0) {
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
          <span className={styles["market-options__actions-button-percentage"]}>
            {(outcomeToken.price * 100).toFixed(2)}%
          </span>
        </Button>
      );
    })}
  </>
);
