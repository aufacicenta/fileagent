import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { PulseSymbolIcon } from "ui/icons/PulseSymbolIcon";
import { PulseIcon } from "ui/icons/PulseIcon";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Icon } from "ui/icon/Icon";
import { Typography } from "ui/typography/Typography";
import { ThemeSelector } from "ui/theme-selector/ThemeSelector";
import { WalletSelectorMobile } from "ui/wallet-selector/WalletSelectorMobile";

import styles from "./PulseSidebar.module.scss";
import { PulseSidebarProps } from "./PulseSidebar.types";

export const PulseSidebar: React.FC<PulseSidebarProps> = ({ className, isOpen, handleOpen, handleClose }) => {
  const routes = useRoutes();
  const { t } = useTranslation(["common"]);

  return (
    <div
      className={clsx({ [styles["pulse-sidebar--open"]]: isOpen }, className)}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <div className={styles["pulse-sidebar__overlay"]} aria-hidden onClick={handleClose} />
      <div className={styles["pulse-sidebar__layout"]}>
        <div className={styles["pulse-sidebar__layout--inner"]}>
          <div className={styles["pulse-sidebar__header"]}>
            <Typography.Link href={routes.dashboard.latestTrends()}>
              {isOpen ? <PulseIcon variant="desktop" /> : <PulseSymbolIcon />}
            </Typography.Link>
            <Icon name="icon-cross2" onClick={handleClose} className={styles["pulse-sidebar__header--exit"]} />
          </div>
          <div className={styles["pulse-sidebar__content"]}>
            <div className={styles["pulse-sidebar__item--pill"]}>
              <WalletSelectorMobile />
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.dashboard.latestTrends()}>
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-dashboard" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.dashboard")}</Typography.Description>
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__divider"]}>
              <div className={styles["pulse-sidebar__divider--bar"]} />
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Anchor
                className={styles["pulse-sidebar__item--link"]}
                href="https://rainbowbridge.app/transfer"
                target="_blank"
                rel="nofollow"
              >
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-flip-horizontal2" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.bridge")}</Typography.Description>
              </Typography.Anchor>
            </div>
          </div>
          <div className={styles["pulse-sidebar__footer"]}>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </div>
  );
};
