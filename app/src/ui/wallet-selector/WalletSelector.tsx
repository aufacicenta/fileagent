import clsx from "clsx";
import { useState } from "react";

import { Button } from "../button/Button";
import { Typography } from "ui/typography/Typography";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { useWalletSelectorContext } from "hooks/useWalletSelectorContext/useWalletSelectorContext";
import { WalletSelectorChain } from "context/wallet/selector/WalletSelectorContext.types";
import { Icon } from "ui/icon/Icon";

import styles from "./WalletSelector.module.scss";
import { WalletSelectorProps } from "./WalletSelector.types";

export const WalletSelector: React.FC<WalletSelectorProps> = ({ className }) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  const wallet = useWalletStateContext();
  const selector = useWalletSelectorContext();

  const handleOnConnectWalletClick = () => {
    if (wallet.isConnected.get()) {
      selector.onDisconnect();
    } else {
      selector.onConnect(WalletSelectorChain.near);
    }
  };

  const handleOnDisplayWidgetClick = () => {
    if (wallet.isConnected.get()) {
      setIsWidgetVisible(!isWidgetVisible);
    } else {
      selector.onConnect(WalletSelectorChain.near);
    }
  };

  return (
    <div className={clsx(styles["wallet-selector"], className)}>
      <Button
        color="primary"
        variant="outlined"
        onClick={handleOnDisplayWidgetClick}
        rightIcon={<Icon name={wallet.address.get() ? "icon-power" : "icon-power-crossed"} />}
        className={styles["wallet-selector__button"]}
        size="xs"
      >
        {wallet.isConnected.get() ? (
          <Typography.Text inline truncate flat>
            {wallet.address.get()}
          </Typography.Text>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      {isWidgetVisible && (
        <>
          <div
            className={styles["wallet-selector__widget--backdrop"]}
            onClick={() => setIsWidgetVisible(!isWidgetVisible)}
            role="presentation"
          />
          <div className={styles["wallet-selector__widget"]}>
            <div className={styles["wallet-selector__balance"]}>
              <Typography.Description>Balance</Typography.Description>
              <Typography.Text>{wallet.balance.get()}</Typography.Text>
              <Typography.MiniDescription>
                <Typography.Anchor href={`${wallet.explorer}/accounts/${wallet.address.get()}`} target="_blank">
                  {wallet.isConnected.get() && wallet.address.get()}
                </Typography.Anchor>
              </Typography.MiniDescription>
            </div>
            <div className={styles["wallet-selector__connect"]}>
              <Button size="xs" color="primary" onClick={handleOnConnectWalletClick}>
                {wallet.isConnected.get() ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
