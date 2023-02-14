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
    <div className={clsx(styles["latest-price-markets-table__responsive"])}>
      <table className={clsx(styles["latest-price-markets-table"], className)}>
        <thead>
          <tr>
            <th>
              <Typography.Description>Description</Typography.Description>
            </th>
            <th>
              <Typography.Description>Total Value Locked</Typography.Description>
            </th>
            <th>
              <Typography.Description>Your Stake</Typography.Description>
            </th>
            <th>
              <Typography.Description>Ends in</Typography.Description>
            </th>
            <th>
              <Typography.Description>Status</Typography.Description>
            </th>
            <th>{null}</th>
          </tr>
        </thead>
        <tbody>
          {latestPriceMarketsIds.map((marketId) => (
            <NearMarketContractContextController marketId={marketId} key={marketId}>
              <PriceMarketTableRow marketId={marketId} />
            </NearMarketContractContextController>
          ))}
        </tbody>
      </table>
    </div>
  );
};
