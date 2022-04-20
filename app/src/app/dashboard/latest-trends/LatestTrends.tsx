import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "ui/button/Button";
import { Card } from "ui/card/Card";
import { Grid } from "ui/grid/Grid";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { Typography } from "ui/typography/Typography";

import styles from "./LatestTrends.module.scss";
import { LatestTrendsProps } from "./LatestTrends.types";
import { CreateMarketModalProps } from "./create-market-modal/CreateMarketModal.types";

const CreateMarketModal = dynamic<CreateMarketModalProps>(
  () => import("./create-market-modal/CreateMarketModal").then((mod) => mod.CreateMarketModal),
  { ssr: false },
);

export const LatestTrends: React.FC<LatestTrendsProps> = ({ className }) => {
  const [isCreateMarketModalVisible, setIsCreateMarketModalVisible] = useState(false);

  const { t } = useTranslation(["latest-trends", "common"]);

  const onClickCloseCreateMarketModal = () => {
    setIsCreateMarketModalVisible(false);
  };

  const onClickCreateMarketButton = () => {
    setIsCreateMarketModalVisible(true);
  };

  return (
    <>
      <div className={clsx(styles["latest-trends"], className)}>
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
                    <Button color="primary" onClick={onClickCreateMarketButton}>
                      {t("button.createMarket", { ns: "common" })}
                    </Button>
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
                    <Button color="primary" onClick={onClickCreateMarketButton}>
                      {t("button.createMarket", { ns: "common" })}
                    </Button>
                  </div>
                </Grid.Col>
              </Grid.Row>
            </Card.Content>
          </Card>
        </MainPanel.Container>
      </div>

      {isCreateMarketModalVisible && <CreateMarketModal onClose={onClickCloseCreateMarketModal} />}
    </>
  );
};
