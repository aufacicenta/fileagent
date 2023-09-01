import clsx from "clsx";
import { Hidden } from "react-grid-system";

import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { FileAgentLogo } from "ui/icons/FileAgentLogo";

import { NavbarProps } from "./Navbar.types";
import styles from "./Navbar.module.scss";

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const routes = useRoutes();

  return (
    <div className={clsx(styles.navbar, className)}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={3} sm={3} xs={6}>
            <div className={styles["navbar__logo-mobile"]}>
              <Typography.Link href={routes.dashboard.latestTrends()}>
                <FileAgentLogo />
              </Typography.Link>
            </div>
            <div className={styles["navbar__logo-desktop"]}>
              <Typography.Link href={routes.dashboard.latestTrends()}>
                <FileAgentLogo />
              </Typography.Link>
            </div>
          </Grid.Col>
          <Hidden xs>
            <Grid.Col lg={4} sm={4} xs={4}>
              <div className={styles.navbar__center} />
            </Grid.Col>
          </Hidden>
          <Grid.Col lg={5} sm={5} xs={6}>
            <div className={styles.navbar__right}>
              <div className={styles["navbar__right--item"]} />
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </div>
  );
};
