import clsx from "clsx";
import { useEffect } from "react";

import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";
import { Typography } from "ui/typography/Typography";

import { PriceMarketTableRowProps } from "./PriceMarketTableRow.types";
import styles from "./PriceMarketTableRow.module.scss";

export const PriceMarketTableRow: React.FC<PriceMarketTableRowProps> = ({ className }) => {
  const { fetchMarketContractValues, marketContractValues } = useNearMarketContractContext();

  useEffect(() => {
    fetchMarketContractValues();
  }, []);

  if (!marketContractValues) {
    return null;
  }

  return (
    <tr className={clsx(styles["price-market-table-row"], className)}>
      <td>
        <Typography.Text flat>{marketContractValues.market.description}</Typography.Text>
      </td>
    </tr>
  );
};
