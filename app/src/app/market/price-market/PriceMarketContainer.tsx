import { NearMarketContractContextController } from "context/near/market-contract/NearMarketContractContextController";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { Typography } from "ui/typography/Typography";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Icon } from "ui/icon/Icon";

import styles from "./PriceMarket.module.scss";
import { PriceMarket } from "./PriceMarket";
import { PriceMarketContainerProps } from "./PriceMarket.types";

export const PriceMarketContainer = ({ marketId }: PriceMarketContainerProps) => {
  const routes = useRoutes();

  return (
    <MainPanel.Container>
      {/* @TODO make it a smart breadcrumbs component */}
      <div className={styles["price-market__title-row"]}>
        <Typography.Link href={routes.home()} as="button" variant="text" size="xs">
          <Icon name="icon-chevron-left" /> back to latest price markets
        </Typography.Link>
      </div>
      <NearMarketContractContextController marketId={marketId}>
        <PriceMarket marketId={marketId} />
      </NearMarketContractContextController>
    </MainPanel.Container>
  );
};
