import clsx from "clsx";
import { useEffect } from "react";

import { Button } from "../button/Button";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { BalancePill } from "ui/pulse/sidebar/balance-pill/BalancePill";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useNearWalletSelectorContext } from "hooks/useNearWalletSelectorContext/useNearWalletSelectorContext";
import near from "providers/near";

import styles from "./WalletSelector.module.scss";
import { WalletSelectorProps } from "./WalletSelector.types";

export const WalletSelectorMobile: React.FC<WalletSelectorProps> = ({ className }) => {
  const wallet = useWalletStateContext();
  const nearWalletSelectorContext = useNearWalletSelectorContext();

  useEffect(() => {
    if (!nearWalletSelectorContext.selector) {
      return;
    }

    nearWalletSelectorContext.initModal(near.getConfig().marketFactoryAccountId);
  }, [nearWalletSelectorContext.selector]);

  const handleOnConnectWalletClick = () => {
    if (!wallet.isConnected) {
      nearWalletSelectorContext.modal?.show();
    }
  };

  return (
    <div className={clsx(className)}>
      <Button
        size="xs"
        color="primary"
        variant="outlined"
        onClick={handleOnConnectWalletClick}
        className={styles["wallet-selector--mobile__button"]}
        rightIcon={<Icon name={wallet.address ? "icon-power" : "icon-power-crossed"} />}
      >
        {wallet.isConnected ? (
          <Typography.Text inline truncate flat>
            {wallet.address}
          </Typography.Text>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      {wallet.isConnected ? <BalancePill /> : null}
    </div>
  );
};
