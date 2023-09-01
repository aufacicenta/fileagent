import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { Icon } from "ui/icon/Icon";
import { Typography } from "ui/typography/Typography";
import { WalletSelectorMobile } from "ui/wallet-selector/WalletSelectorMobile";
import { useRoutes } from "hooks/useRoutes/useRoutes";

import styles from "./PulseSidebar.module.scss";
import { PulseSidebarProps } from "./PulseSidebar.types";

// @TODO Create game tiers and add them to the sidebar
// labels: 500 USDT, P1

export const PulseSidebar: React.FC<PulseSidebarProps> = ({ className, isOpen, handleOpen, handleClose }) => {
  const { t } = useTranslation(["common"]);

  const routes = useRoutes();

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
            <Icon name="icon-cross2" onClick={handleClose} className={styles["pulse-sidebar__header--exit"]} />
          </div>
          <div className={styles["pulse-sidebar__content"]}>
            <div className={styles["pulse-sidebar__item--pill"]}>
              <WalletSelectorMobile />
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link
                className={styles["pulse-sidebar__item--link"]}
                href={routes.dashboard.promptWars.home()}
              >
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-portrait2" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.promptWars")}</Typography.Description>
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link
                className={styles["pulse-sidebar__item--link"]}
                href={routes.dashboard.promptWars.previousMarkets()}
              >
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-pictures" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.previousMarkets")}</Typography.Description>
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__divider"]}>
              <div className={styles["pulse-sidebar__divider--bar"]} />
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Anchor
                className={styles["pulse-sidebar__item--link"]}
                href="https://app.ref.finance/#near|usdt.tether-token.near"
                target="_blank"
                rel="nofollow"
              >
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-shuffle" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.swap")}</Typography.Description>
              </Typography.Anchor>
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
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Anchor
                className={styles["pulse-sidebar__item--link"]}
                href="https://twitter.com/promptwars"
                target="_blank"
                rel="nofollow"
              >
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-bubbles" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.feedback")}</Typography.Description>
              </Typography.Anchor>
            </div>
          </div>
          <div className={styles["pulse-sidebar__footer"]} />
        </div>
      </div>
    </div>
  );
};
