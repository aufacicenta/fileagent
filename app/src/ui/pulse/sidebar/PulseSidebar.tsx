import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { Icon } from "ui/icon/Icon";
import { Typography } from "ui/typography/Typography";
import { WalletSelectorMobile } from "ui/wallet-selector/WalletSelectorMobile";

import styles from "./PulseSidebar.module.scss";
import { PulseSidebarProps } from "./PulseSidebar.types";

export const PulseSidebar: React.FC<PulseSidebarProps> = ({ className, isOpen, handleOpen, handleClose }) => {
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
            <Icon name="icon-cross2" onClick={handleClose} className={styles["pulse-sidebar__header--exit"]} />
          </div>
          <div className={styles["pulse-sidebar__content"]}>
            <div className={styles["pulse-sidebar__item--pill"]}>
              <WalletSelectorMobile />
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Anchor
                className={styles["pulse-sidebar__item--link"]}
                href="https://github.com/aufacicenta/pulsemarkets"
                target="_blank"
                rel="nofollow"
              >
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-file-code" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.code")}</Typography.Description>
              </Typography.Anchor>
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Anchor
                className={styles["pulse-sidebar__item--link"]}
                href="https://docs.pulsemarkets.org"
                target="_blank"
                rel="nofollow"
              >
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-reading" />
                </div>
                <Typography.Description flat>{t("pulseSidebar.item.docs")}</Typography.Description>
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
          </div>
          <div className={styles["pulse-sidebar__footer"]} />
        </div>
      </div>
    </div>
  );
};
