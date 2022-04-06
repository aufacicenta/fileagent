import clsx from "clsx";
import { useState } from "react";

import { useWalletSelectorContext } from "hooks/useWalletSelectorContext/useWalletSelectorContext";
import { Button } from "../button/Button";
import { Typography } from "ui/typography/Typography";

import styles from "./WalletSelector.module.scss";
import { WalletSelectorProps } from "./WalletSelector.types";

export const WalletSelector: React.FC<WalletSelectorProps> = ({ className }) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  const wallet = useWalletSelectorContext();

  const handleOnConnectWalletClick = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (
    <div className={clsx(styles["wallet-selector"], className)}>
      <Button size="xs" variant="gradient" color="secondary" onClick={handleOnConnectWalletClick}>
        {wallet.isConnected ? (
          <Typography.Text inline truncate>
            {wallet.address}
          </Typography.Text>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      {isWidgetVisible && (
        <>
          <div
            className={styles["wallet-selector__widget--backdrop"]}
            onClick={handleOnConnectWalletClick}
            role="presentation"
          />
          <div className={styles["wallet-selector__widget"]}>
            <div className={styles["wallet-selector__balance"]}>
              <Typography.Description>Balance</Typography.Description>
              <Typography.Text>{wallet.balance}</Typography.Text>
              <Typography.MiniDescription>
                <Typography.Anchor href={`${wallet.explorer}/accounts/${wallet.address}`} target="_blank">
                  {wallet.isConnected && wallet.address}
                </Typography.Anchor>
              </Typography.MiniDescription>
            </div>
            <div className={styles["wallet-selector__connect"]}>
              <Button size="xs" variant="gradient" color="secondary" onClick={() => wallet.onClickConnect()}>
                {wallet.isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
