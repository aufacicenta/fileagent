import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import pulse from "providers/pulse";
import { CollateralTokenBalance } from "ui/pulse/market-card/collateral-token-balance/CollateralTokenBalance";

import { BalancePillProps } from "./BalancePill.types";
import styles from "./BalancePill.module.scss";

export const BalancePill: React.FC<BalancePillProps> = ({ className }) => {
  const wallet = useWalletStateContext();

  return (
    <div className={clsx(styles["balance-pill"], className)}>
      <div className={styles["balance-pill__wrapper"]}>
        <Typography.Description>Native Balance</Typography.Description>
        <Typography.Text truncate className={styles["balance-pill__wrapper--amount"]}>
          {wallet.balance}
        </Typography.Text>
        <Typography.Description>
          Balance <code>@{pulse.getDefaultCollateralToken().accountId}</code>
        </Typography.Description>
        <Typography.Text flat inline truncate className={styles["balance-pill__wrapper--amount"]}>
          <CollateralTokenBalance
            accountId={wallet.address!}
            contractAddress={pulse.getDefaultCollateralToken().accountId}
          />
        </Typography.Text>
      </div>
    </div>
  );
};
