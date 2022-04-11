import clsx from "clsx";
import { useState } from "react";

import { PulseSymbolIcon } from "ui/icons/PulseSymbolIcon";
import { PulseIcon } from "ui/icons/PulseIcon";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Icon } from "ui/icon/Icon";
import { Typography } from "ui/typography/Typography";
import { ThemeSelector } from "ui/theme-selector/ThemeSelector";

import styles from "./PulseSidebar.module.scss";
import { PulseSidebarProps } from "./PulseSidebar.types";

export const PulseSidebar: React.FC<PulseSidebarProps> = ({ className }) => {
  const routes = useRoutes();
  const [open, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={clsx(styles["pulse-sidebar"], { [styles["pulse-sidebar--open"]]: open }, className)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className={styles["pulse-sidebar__layout"]}>
          <div className={styles["pulse-sidebar__layout--inner"]}>
            <div className={styles["pulse-sidebar__header"]}>
              <Typography.Link href={routes.home}>
                {open ? <PulseIcon variant="desktop" /> : <PulseSymbolIcon />}
              </Typography.Link>
            </div>
            <div className={styles["pulse-sidebar__content"]}>
              <div className={styles["pulse-sidebar__item"]}>
                <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                  <div className={styles["pulse-sidebar__item--icon"]}>
                    <Icon name="icon-menu-square" />
                  </div>
                  <Typography.Description>Dashboard</Typography.Description>
                </Typography.Link>
              </div>
              <div className={styles["pulse-sidebar__item"]}>
                <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                  <div className={styles["pulse-sidebar__item--icon"]}>
                    <Icon name="icon-tv" />
                  </div>
                  <Typography.Description>Sport & Betting</Typography.Description>
                </Typography.Link>
              </div>
              <div className={styles["pulse-sidebar__item"]}>
                <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                  <div className={styles["pulse-sidebar__item--icon"]}>
                    <Icon name="icon-checkmark-circle" />
                  </div>
                  <Typography.Description>Bets</Typography.Description>
                </Typography.Link>
              </div>
              <div className={styles["pulse-sidebar__item"]}>
                <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                  <div className={styles["pulse-sidebar__item--icon"]}>
                    <Icon name="icon-user" />
                  </div>
                  <Typography.Description>Profile</Typography.Description>
                </Typography.Link>
              </div>
              <div className={styles["pulse-sidebar__divider"]}>
                <div className={styles["pulse-sidebar__divider--bar"]} />
              </div>
              <div className={styles["pulse-sidebar__item"]}>
                <Typography.Link className={styles["pulse-sidebar__item--link"]} href={routes.home}>
                  <div className={styles["pulse-sidebar__item--icon"]}>
                    <Icon name="icon-exit" />
                  </div>
                  <Typography.Description>Close</Typography.Description>
                </Typography.Link>
              </div>
            </div>
            <div className={styles["pulse-sidebar__footer"]}>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PulseSidebar;
