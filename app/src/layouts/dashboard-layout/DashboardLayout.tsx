import clsx from "clsx";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { WalletSelectorNavbar } from "ui/wallet-selector-navbar/WalletSelectorNavbar";
import { ToastContextController } from "context/toast/ToastContextController";
import { PulseSidebar } from "ui/pulse/sidebar/PulseSidebar";
import { NearWalletSelectorContextController } from "context/near/wallet-selector/NearWalletSelectorContextController";
import { WalletStateContextController } from "context/wallet/state/WalletStateContextController";
import { FixedTopAlert } from "ui/fixed-top-alert/FixedTopAlert";
import { Typography } from "ui/typography/Typography";

import { DashboardLayoutProps } from "./DashboardLayout.types";
import styles from "./DashboardLayout.module.scss";

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarVisibility] = useState(false);
  const { t } = useTranslation("head");
  const { locale } = useRouter();

  useEffect(() => {
    // @todo set with a toggle button from navbar or footer
    document.body.dataset.theme = "dark";
  }, []);

  return (
    <>
      <Head>
        <title>{t("head.og.title")}</title>
        <link rel="icon" href="/favicon.ico" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="description" content={t("head.og.description")} />
        <meta property="og:title" content={t("head.og.title")} />
        <meta property="og:description" content={t("head.og.description")} />
        <meta property="og:image" content="/shared/pulse.png" />
        <meta property="og:url" content="https://airdrop.pulsemarkets.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
      </Head>
      <WalletStateContextController>
        <NearWalletSelectorContextController>
          <ToastContextController>
            <FixedTopAlert>
              <Typography.Text flat>
                <strong>Disclaimer</strong>: This is a beta dApp. Pulse contracts have not been audited. Use at your own
                risk.
              </Typography.Text>
            </FixedTopAlert>
            <div id="modal-root" />
            <div id="dropdown-portal" />
            <div
              className={clsx(styles["dashboard-layout"], {
                [styles["dashboard-layout__with-top-alert"]]: true,
              })}
            >
              <PulseSidebar
                isOpen={isSidebarOpen}
                handleOpen={() => setSidebarVisibility(true)}
                handleClose={() => setSidebarVisibility(false)}
              />
              <WalletSelectorNavbar onClickSidebarVisibility={() => setSidebarVisibility(true)} />
              <MainPanel>{children}</MainPanel>
            </div>
          </ToastContextController>
        </NearWalletSelectorContextController>
      </WalletStateContextController>
    </>
  );
};
