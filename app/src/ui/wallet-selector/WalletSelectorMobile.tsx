import clsx from "clsx";

import { Button } from "../button/Button";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { useWalletSelectorContext } from "hooks/useWalletSelectorContext/useWalletSelectorContext";
import { WalletSelectorChain } from "context/wallet/selector/WalletSelectorContext.types";
import { BalancePill } from "ui/pulse/sidebar/balance-pill/BalancePill";

import styles from "./WalletSelector.module.scss";
import { WalletSelectorProps } from "./WalletSelector.types";

export const WalletSelectorMobile: React.FC<WalletSelectorProps> = ({ className }) => {
  const wallet = useWalletStateContext();
  const selector = useWalletSelectorContext();

  const handleOnConnectWalletClick = () => {
    if (wallet.isConnected.get()) {
      selector.onDisconnect();
    } else {
      selector.onConnect(WalletSelectorChain.near);
    }
  };

  return (
    <div className={clsx(styles["wallet-selector--mobile"], className)}>
      <Button size="auto" color="primary" onClick={handleOnConnectWalletClick}>
        {wallet.isConnected.get() ? "Disconnect Wallet" : "Connect Wallet"}
      </Button>
      {wallet.isConnected.get() ? <BalancePill /> : null}
    </div>
  );
};
