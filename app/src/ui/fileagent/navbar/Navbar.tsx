import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { FileAgentLogo } from "ui/icons/FileAgentLogo";
import { useThemeContext } from "context/theme/useThemeContext";

import { NavbarProps } from "./Navbar.types";
import styles from "./Navbar.module.scss";

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { theme } = useThemeContext();

  return (
    <div className={clsx(styles.navbar, className)}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={4} sm={4} xs={4}>
            <div className={styles.navbar__left} />
          </Grid.Col>
          <Grid.Col lg={4} sm={4} xs={4}>
            <div className={clsx(styles.navbar__logo, styles["navbar__logo-mobile"])}>
              <Typography.Link href="#">
                <FileAgentLogo theme={theme} />
              </Typography.Link>
            </div>
            <div className={clsx(styles.navbar__logo, styles["navbar__logo-desktop"])}>
              <Typography.Link href="#">
                <FileAgentLogo theme={theme} />
              </Typography.Link>
            </div>
          </Grid.Col>
          <Grid.Col lg={4} sm={4} xs={4}>
            <div className={styles.navbar__right}>
              <div className={styles["navbar__right--item"]} />
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </div>
  );
};
