import clsx from "clsx";
import { useEffect } from "react";

import { Typography } from "ui/typography/Typography";
import { useNearPromptWarsMarketContractContext } from "context/near/prompt-wars-market-contract/useNearPromptWarsMarketContractContext";
import ipfs from "providers/ipfs";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import date from "providers/date";

import styles from "./PreviousRoundsTableRow.module.scss";
import { PreviousRoundsTableRowProps } from "./PreviousRoundsTableRow.types";

export const PreviousRoundsTableRow: React.FC<PreviousRoundsTableRowProps> = ({ className, marketId }) => {
  const { fetchMarketContractValues, marketContractValues } = useNearPromptWarsMarketContractContext();

  const routes = useRoutes();

  useEffect(() => {
    fetchMarketContractValues();
  }, [marketId]);

  if (!marketContractValues) return null;

  return (
    <tr className={clsx(styles["previous-rounds-table-row"], className)}>
      <td>
        <img
          src={ipfs.asHttpsURL(marketContractValues?.market.image_uri)}
          className={clsx(styles["previous-rounds-table-row__thumbnail"])}
          alt="market thumbnail"
        />
      </td>
      <td>
        <Typography.Description flat>{marketContractValues?.resolution.result}</Typography.Description>
      </td>
      <td>
        <Typography.Description flat>{marketContractValues?.outcomeIds.length}</Typography.Description>
      </td>
      <td>
        <Typography.Description flat>
          {date.fromTimestampWithOffset(marketContractValues?.market.starts_at, 0)}
        </Typography.Description>
      </td>
      <td>
        <Typography.Description flat>
          {date.fromTimestampWithOffset(marketContractValues?.market.ends_at, 0)}
        </Typography.Description>
      </td>
      <td>
        {marketContractValues?.isResolved ? (
          <Typography.Description flat className={clsx(styles["previous-rounds-table-row__resolved"])}>
            resolved
          </Typography.Description>
        ) : (
          <Typography.Description flat>unresolved</Typography.Description>
        )}
      </td>
      <td>
        <Typography.Link
          className={clsx(styles["previous-rounds-table-row__link"])}
          href={routes.dashboard.promptWars.market({ marketId })}
        >
          See details
        </Typography.Link>
      </td>
    </tr>
  );
};
