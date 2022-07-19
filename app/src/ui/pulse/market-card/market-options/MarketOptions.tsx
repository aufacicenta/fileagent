import { Button } from "ui/button/Button";
import pulse from "providers/pulse";
import currency from "providers/currency";

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
            {option}{" "}
            <span className={styles["market-options__actions-button-percentage"]}>
              {Number(100 / market.options.length)
                .toFixed(currency.constants.DEFAULT_DECIMALS_PRECISION)
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
          {option}{" "}
          <span className={styles["market-options__actions-button-percentage"]}>{outcomeToken.price * 100}%</span>
        </Button>
      );
    })}
  </>
);
