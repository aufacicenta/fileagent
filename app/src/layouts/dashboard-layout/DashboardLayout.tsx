import clsx from "clsx";
import Head from "next/head";
import { Near } from "near-api-js";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { WalletSelectorNavbar } from "ui/wallet-selector-navbar/WalletSelectorNavbar";
import { WalletSelectorContextController } from "context/wallet-selector/WalletSelectorContextController";
import { useWalletState } from "hooks/useWalletState/useWalletState";
import { WalletSelectorContextType } from "context/wallet-selector/WalletSelectorContext.types";
import { Icon } from "ui/icon/Icon";
import { ToastContextController } from "context/toast/ToastContextController";
import { PulseSidebar } from "ui/pulse/sidebar/PulseSidebar";

import { DashboardLayoutProps } from "./DashboardLayout.types";
import styles from "./DashboardLayout.module.scss";

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const walletState = useWalletState();
  const [isSidebarOpen, setSidebarVisibility] = useState(false);
  const { t } = useTranslation("head");
  const { locale } = useRouter();

  useEffect(() => {
    // @todo set with a toggle button from navbar or footer
    document.body.dataset.theme = "dark";
  }, []);

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
    <>
      <Head>
        <title>{t("head.og.title")}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap" rel="stylesheet" />
        <meta name="description" content={t("head.og.description")} />
        <meta property="og:title" content={t("head.og.title")} />
        <meta property="og:description" content={t("head.og.description")} />
        <meta property="og:image" content="/shared/pulse.png" />
        <meta property="og:url" content="https://airdrop.pulsemarkets.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        <link rel="preload" href="/icons/icomoon.eot" as="font" crossOrigin="" />
        <link rel="preload" href="/icons/icomoon.ttf" as="font" crossOrigin="" />
        <link rel="preload" href="/icons/icomoon.woff" as="font" crossOrigin="" />
        <link rel="preload" href="/icons/icomoon.svg" as="font" crossOrigin="" />
      </Head>
      <WalletSelectorContextController {...props}>
        <ToastContextController>
          <div id="modal-root" />
          <div id="dropdown-portal" />
          <div className={clsx(styles["dashboard-layout"])}>
            <PulseSidebar
              isOpen={isSidebarOpen}
              handleOpen={() => setSidebarVisibility(true)}
              handleClose={() => setSidebarVisibility(false)}
            />
            <WalletSelectorNavbar>
              <Icon
                name="icon-pulse-menu-2"
                onClick={() => setSidebarVisibility(true)}
                className={styles["dashboard-layout__sidebar--trigger"]}
              />
            </WalletSelectorNavbar>
            <MainPanel>{children}</MainPanel>
          </div>
        </ToastContextController>
      </WalletSelectorContextController>
    </>
  );
};
