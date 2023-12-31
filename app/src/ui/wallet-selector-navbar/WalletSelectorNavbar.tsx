import { Hidden } from "react-grid-system";

import { Grid } from "ui/grid/Grid";
import { Icon } from "ui/icon/Icon";
import { WalletSelector } from "ui/wallet-selector/WalletSelector";
import { Typography } from "ui/typography/Typography";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { PromptWarsLogo } from "ui/icons/PromptWarsLogo";

import { WalletSelectorNavbarProps } from "./WalletSelectorNavbar.types";
import styles from "./WalletSelectorNavbar.module.scss";

export const WalletSelectorNavbar: React.FC<WalletSelectorNavbarProps> = ({ onClickSidebarVisibility }) => {
  const routes = useRoutes();

  return (
    <div className={styles["wallet-selector-navbar"]}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={3} sm={3} xs={6}>
            <div className={styles["wallet-selector-navbar__logo-mobile"]}>
              <Typography.Link href={routes.dashboard.latestTrends()}>
                <PromptWarsLogo />
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
                <Icon
                  name="icon-menu"
                  onClick={() => onClickSidebarVisibility(true)}
                  className={styles["wallet-selector-navbar__right--trigger"]}
                />
                <WalletSelector />
              </div>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </div>
  );
};
