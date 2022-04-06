import { Hidden } from "react-grid-system";

import { Typography } from "../typography/Typography";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Grid } from "ui/grid/Grid";
import { WalletSelector } from "ui/wallet-selector/WalletSelector";
import { ThemeSelector } from "ui/theme-selector/ThemeSelector";
import { PulseIcon } from "ui/icons/PulseIcon";

import { WalletSelectorNavbarProps } from "./WalletSelectorNavbar.types";
import styles from "./WalletSelectorNavbar.module.scss";

export const WalletSelectorNavbar: React.FC<WalletSelectorNavbarProps> = () => {
  const routes = useRoutes();

  return (
    <div className={styles["wallet-selector-navbar"]}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={3} sm={3} xs={6}>
            <div className={styles["wallet-selector-navbar__logo-mobile"]}>
              <Typography.Link href={routes.home}>
                <PulseIcon variant="mobile" />
              </Typography.Link>
            </div>
            <div className={styles["wallet-selector-navbar__logo-desktop"]}>
              <Typography.Link href={routes.home}>
                <PulseIcon variant="desktop" />
              </Typography.Link>
            </div>
          </Grid.Col>
          <Hidden xs>
            <Grid.Col lg={4} sm={4} xs={4}>
              <div className={styles["wallet-selector-navbar__center"]} />
            </Grid.Col>
          </Hidden>
          <Grid.Col lg={5} sm={5} xs={6}>
            <div className={styles["wallet-selector-navbar__right"]}>
              <div className={styles["wallet-selector-navbar__right--item"]}>
                <ThemeSelector />
              </div>
              <div className={styles["wallet-selector-navbar__right--item"]}>
                <WalletSelector />
              </div>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </div>
  );
};
