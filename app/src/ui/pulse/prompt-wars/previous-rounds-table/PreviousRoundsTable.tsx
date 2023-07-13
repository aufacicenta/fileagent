import clsx from "clsx";

import { NearPromptWarsMarketContractContextController } from "context/near/prompt-wars-market-contract/NearPromptWarsMarketContractContextController";
import { PreviousRoundsTableRow } from "../previous-rounds-table-row/PreviousRoundsTableRow";
import { Typography } from "ui/typography/Typography";

import styles from "./PreviousRoundsTable.module.scss";
import { PreviousRoundsTableProps } from "./PreviousRoundsTable.types";

export const PreviousRoundsTable: React.FC<PreviousRoundsTableProps> = ({ className, markets }) => (
  <div className={clsx(styles["previous-rounds-table__responsive"], className)}>
    <table className={clsx(styles["previous-rounds-table"], className)}>
      <thead>
        <tr>
          <th>
            <Typography.Description>Image</Typography.Description>
          </th>
          <th>
            <Typography.Description>Winner</Typography.Description>
          </th>
          <th>
            <Typography.Description>No. of Players</Typography.Description>
          </th>
          <th>
            <Typography.Description>Started at</Typography.Description>
          </th>
          <th>
            <Typography.Description>Ended at</Typography.Description>
          </th>
          <th>
            <Typography.Description>Status</Typography.Description>
          </th>
          <th>{null}</th>
        </tr>
      </thead>
      <tbody>
        {markets.map((marketId) => (
          <NearPromptWarsMarketContractContextController marketId={marketId} key={marketId}>
            <PreviousRoundsTableRow marketId={marketId} />
          </NearPromptWarsMarketContractContextController>
        ))}
      </tbody>
    </table>
  </div>
);
