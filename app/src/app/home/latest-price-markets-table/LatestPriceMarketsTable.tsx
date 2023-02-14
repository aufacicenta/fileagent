import clsx from "clsx";

import { useNearMarketFactoryContractContext } from "context/near/market-factory-contract/useNearMarketFactoryContractContext";
import { NearMarketContractContextController } from "context/near/market-contract/NearMarketContractContextController";
import { Typography } from "ui/typography/Typography";

import { LatestPriceMarketsTableProps } from "./LatestPriceMarketsTable.types";
import styles from "./LatestPriceMarketsTable.module.scss";
import { PriceMarketTableRow } from "./price-market-table-row/PriceMarketTableRow";

export const LatestPriceMarketsTable: React.FC<LatestPriceMarketsTableProps> = ({ className }) => {
  const { latestPriceMarketsIds } = useNearMarketFactoryContractContext();

  return (
    <table className={clsx(styles["latest-price-markets-table"], className)}>
      <thead>
        <th>
          <Typography.Description>Description</Typography.Description>
        </th>
      </thead>
      <tbody>
        {latestPriceMarketsIds.map((marketId) => (
          <NearMarketContractContextController marketId={marketId}>
            <PriceMarketTableRow key={marketId} marketId={marketId} />
          </NearMarketContractContextController>
        ))}
      </tbody>
    </table>
  );
};
