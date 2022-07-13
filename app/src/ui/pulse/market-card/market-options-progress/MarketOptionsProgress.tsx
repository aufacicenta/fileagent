import pulse from "providers/pulse";

import { MarketOptionsProgressProps } from "./MarketOptionsProgress.types";
import styles from "./MarketOptionsProgress.module.scss";

export const MarketOptionsProgress = ({
  marketContractValues: { market, isPublished, outcomeTokens },
}: MarketOptionsProgressProps) => (
  <>
    {market.options.map((option, id) => {
      if (!isPublished && outcomeTokens?.length === 0) {
        return (
          <div
            className={styles["market-options-progress__progres-bar-width"]}
            style={{
              width: `${100 / market.options.length}%`,
              backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id],
            }}
            key={option}
          />
        );
      }

      const outcomeToken = outcomeTokens![id];

      return (
        <div
          className={styles["market-options-progress__progres-bar-width"]}
          style={{ width: `${outcomeToken.price * 100}%`, backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id] }}
          key={option}
        />
      );
    })}
  </>
);
