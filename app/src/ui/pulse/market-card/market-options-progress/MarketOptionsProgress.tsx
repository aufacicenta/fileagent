import pulse from "providers/pulse";

import { MarketOptionsProgressProps } from "./MarketOptionsProgress.types";
import styles from "./MarketOptionsProgress.module.scss";

export const MarketOptionsProgress = ({
  marketContractValues: { market, isResolved, outcomeTokens },
}: MarketOptionsProgressProps) => (
  <>
    {market.options.map((option, id) => {
      if (!isResolved && outcomeTokens?.length === 0) {
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
      const totalSupply = outcomeTokens?.reduce<number>((prev, current) => prev + current.total_supply, 0);
      const weight =
        totalSupply === 0 ? Number(100 / market.options.length) : (outcomeToken.total_supply / totalSupply!) * 100;

      return (
        <div
          className={styles["market-options-progress__progres-bar-width"]}
          style={{ width: `${weight * 100}%`, backgroundColor: pulse.constants.COMPLEMENTARY_COLORS[id] }}
          key={option}
        />
      );
    })}
  </>
);
