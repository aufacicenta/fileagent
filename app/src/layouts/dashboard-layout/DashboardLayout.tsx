import clsx from "clsx";
import { Near } from "near-api-js";
import { useState } from "react";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { PulseSidebar } from "ui/pulse-sidebar/PulseSidebar";
import { WalletSelectorNavbar } from "ui/wallet-selector-navbar/WalletSelectorNavbar";
import { WalletSelectorContextController } from "context/wallet-selector/WalletSelectorContextController";
import { useWalletState } from "hooks/useWalletState/useWalletState";
import { WalletSelectorContextType } from "context/wallet-selector/WalletSelectorContext.types";
import { Icon } from "ui/icon/Icon";

import { DashboardLayoutProps } from "./DashboardLayout.types";
import styles from "./DashboardLayout.module.scss";

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const walletState = useWalletState();
  const [isSidebarOpen, setSidebarVisibility] = useState(false);

  // Leaving here just for now
  const props: WalletSelectorContextType = {
    onClickConnect: () => null,
    isConnected: walletState.isConnected.get(),
    network: walletState.network.get(),
    explorer: walletState.explorer.get(),
    chain: walletState.chain.get(),
    address: walletState.address.get(),
    balance: walletState.balance.get(),
    onSetChain: () => null,
    context: {
      connection: undefined,
      provider: {} as Near,
      guest: {
        address: "",
      },
    },
  };

  return (
    <WalletSelectorContextController {...props}>
      <div id="modal-root" />
      <div id="dropdown-portal" />
      <div className={clsx(styles["dashboard-layout"])}>
        <PulseSidebar
          isOpen={isSidebarOpen}
          handleOpen={() => setSidebarVisibility(true)}
          handleClose={() => setSidebarVisibility(false)}
        />
        <WalletSelectorNavbar>
          <Icon name="icon-pulse-menu" onClick={() => setSidebarVisibility(true)} />
        </WalletSelectorNavbar>
        <MainPanel>{children}</MainPanel>
      </div>
    </WalletSelectorContextController>
  );
};
