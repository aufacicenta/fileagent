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

  const handleToggleSidebar = () => {
    setIsOpen(!open);
  };

  return (
    <>
      <div className={clsx(styles["pulse-sidebar"], { [styles["pulse-sidebar--open"]]: open }, className)}>
        <div className={styles["pulse-sidebar__layout"]}>
          <div className={styles["pulse-sidebar__header"]}>
            <div />
            <Typography.Link href={routes.home}>
              {open ? <PulseIcon variant="desktop" /> : <PulseSymbolIcon />}
            </Typography.Link>{" "}
          </div>
          <div
            className={styles["pulse-sidebar__content"]}
            onMouseEnter={handleToggleSidebar}
            onMouseLeave={handleToggleSidebar}
          >
            <Typography.Link className={styles["pulse-sidebar__item"]} href={routes.app.dashboard}>
              <div className={styles["pulse-sidebar__item-icon"]}>
                <Icon name="icon-menu-square" />
              </div>
              <Typography.Text className={styles["pulse-sidebar__item-text"]}>Dashboard</Typography.Text>
            </Typography.Link>
            <Typography.Link className={styles["pulse-sidebar__item"]} href={routes.app.sports}>
              <div className={styles["pulse-sidebar__item-icon"]}>
                <Icon name="icon-screen" />
              </div>
              <Typography.Text className={styles["pulse-sidebar__item-text"]}>Sport & Betting</Typography.Text>
            </Typography.Link>
            <Typography.Link className={styles["pulse-sidebar__item"]} href={routes.app.bets}>
              <div className={styles["pulse-sidebar__item-icon"]}>
                <Icon name="icon-checkmark-circle" />
              </div>
              <Typography.Text className={styles["pulse-sidebar__item-text"]}>Bets</Typography.Text>
            </Typography.Link>
            <Typography.Link className={styles["pulse-sidebar__item"]} href={routes.app.profile}>
              <div className={styles["pulse-sidebar__item-icon"]}>
                <Icon name="icon-user" />
              </div>
              <Typography.Text className={styles["pulse-sidebar__item-text"]}>Profile</Typography.Text>
            </Typography.Link>
            <hr className={styles["pulse-sidebar__divider"]} />
            <Typography.Link className={styles["pulse-sidebar__item"]} href={routes.home}>
              <div className={styles["pulse-sidebar__item-icon"]}>
                <Icon name="icon-exit" />
              </div>
              <Typography.Text className={styles["pulse-sidebar__item-text"]}>Close</Typography.Text>
            </Typography.Link>
          </div>
          <div className={styles["pulse-sidebar__footer"]}>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </>
  );
};

export default PulseSidebar;
