import clsx from "clsx";

import { PulseSymbolIcon } from "ui/icons/PulseSymbolIcon";
import { PulseIcon } from "ui/icons/PulseIcon";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Icon } from "ui/icon/Icon";
import { Typography } from "ui/typography/Typography";
import { ThemeSelector } from "ui/theme-selector/ThemeSelector";

import styles from "./PulseSidebar.module.scss";
import { PulseSidebarProps } from "./PulseSidebar.types";

export const PulseSidebar: React.FC<PulseSidebarProps> = ({ className, isOpen, handleOpen, handleClose }) => {
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
            <Typography.Link href={routes.home}>
              {isOpen ? <PulseIcon variant="desktop" /> : <PulseSymbolIcon />}
            </Typography.Link>
            <Icon name="icon-cross" onClick={handleClose} className={styles["pulse-sidebar__header--exit"]} />
          </div>
          <div className={styles["pulse-sidebar__content"]}>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-dashboard" />
                </div>
                <Typography.Description flat>Dashboard</Typography.Description>
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-sports" />
                </div>
                <Typography.Description flat>Sport & Betting</Typography.Description>
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-bets" />
                </div>
                <Typography.Description flat>Bets</Typography.Description>
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-profile-2" />
                </div>
                <Typography.Description flat>Profile</Typography.Description>
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__divider"]}>
              <div className={styles["pulse-sidebar__divider--bar"]} />
            </div>
            <div className={styles["pulse-sidebar__item"]}>
              <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                <div className={styles["pulse-sidebar__item--icon"]}>
                  <Icon name="icon-logout" />
                </div>
                <Typography.Description flat>Close</Typography.Description>
              </Typography.Link>
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
