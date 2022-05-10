import clsx from "clsx";

import { Typography } from "ui/typography/Typography";

import { BalancePillProps } from "./BalancePill.types";
import styles from "./BalancePill.module.scss";

export const BalancePill: React.FC<BalancePillProps> = ({ className }) => {
  // @TODO Will be replaced by balance coming from wallet context
  const balance = 25.99;

  return (
    <div className={clsx(styles["balance-pill"], className)}>
      <div className={styles["balance-pill__wrapper"]}>
        <div>
          <Typography.Description flat>My Balance:</Typography.Description>
        </div>
        <div className={styles["balance-pill__wrapper--amount"]}>
          <Typography.Description>{balance} NEAR</Typography.Description>
        </div>
      </div>
    </div>
  );
};
