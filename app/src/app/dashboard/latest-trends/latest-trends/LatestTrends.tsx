import clsx from "clsx";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { Typography } from "ui/typography/Typography";

import styles from "./LatestTrends.module.scss";
import { LatestTrendsProps } from "./LatestTrends.types";

export const LatestTrends: React.FC<LatestTrendsProps> = ({ className }) => (
  <div className={clsx(styles["latest-trends"], className)}>
    <MainPanel>
      <MainPanel.Container>
        <Typography.Headline1>Latest Trends</Typography.Headline1>
      </MainPanel.Container>
    </MainPanel>
  </div>
);
