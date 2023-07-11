import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { AufacicentaIcon } from "ui/icons/AufacicentaIcon";

import styles from "./Footer.module.scss";
import { FooterProps } from "./Footer.types";

export const Footer: React.FC<FooterProps> = ({ className }) => (
  <footer className={clsx(styles.footer, className)}>
    <Grid.Container>
      <Grid.Row justify="end">
        <Grid.Col xs={12}>
          <div className={styles.footer__right}>
            <Typography.Anchor
              flat
              href="https://aufacicenta.com"
              target="_blank"
              className={styles["footer__powered-by"]}
            >
              <AufacicentaIcon /> Made by Aufacicenta,
            </Typography.Anchor>
            <Typography.Anchor
              flat
              href="https://docs.pulsemarkets.org"
              target="_blank"
              className={styles["footer__powered-by"]}
            >
              &nbsp; powered by Pulse Protocol
            </Typography.Anchor>
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>
  </footer>
);
