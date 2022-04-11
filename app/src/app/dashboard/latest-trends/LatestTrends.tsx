import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { Button } from "ui/button/Button";
import { Card } from "ui/card/Card";
import { Grid } from "ui/grid/Grid";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { PulseSidebar } from "ui/pulse-sidebar/PulseSidebar";
import { Typography } from "ui/typography/Typography";

import styles from "./LatestTrends.module.scss";
import { LatestTrendsProps } from "./LatestTrends.types";

export const LatestTrends: React.FC<LatestTrendsProps> = ({ className }) => {
  const { t } = useTranslation(["latest-trends", "common"]);

  return (
    <div className={clsx(styles["latest-trends"], className)}>
      <PulseSidebar />
      <MainPanel>
        <MainPanel.Container>
          <div className={styles["latest-trends__filters"]}>
            <Grid.Row align="center">
              <Grid.Col lg={6} xs={6}>
                <Typography.Headline1>{t("latestTrends.title")}</Typography.Headline1>
              </Grid.Col>
              <Grid.Col lg={6} xs={6}>
                .
              </Grid.Col>
            </Grid.Row>
            <div className={styles["latest-trends__filters--desktop"]}>
              <Grid.Row align="center">
                <Grid.Col lg={6} xs={6}>
                  .
                </Grid.Col>
                <Grid.Col lg={6} xs={6}>
                  <div className={styles["latest-trends__filters--actions"]}>
                    <Button color="primary">{t("button.createMarket", { ns: "common" })}</Button>
                  </div>
                </Grid.Col>
              </Grid.Row>
            </div>
          </div>
          <Card>
            <Card.Content>
              <Grid.Row>
                <Grid.Col lg={6}>.</Grid.Col>
                <Grid.Col lg={6}>
                  <div className={styles["latest-trends__card--actions"]}>
                    <Button color="primary">{t("button.createMarket", { ns: "common" })}</Button>
                  </div>
                </Grid.Col>
              </Grid.Row>
            </Card.Content>
          </Card>
        </MainPanel.Container>
      </MainPanel>
    </div>
  );
};
