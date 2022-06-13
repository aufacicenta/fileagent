import clsx from "clsx";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS
import { GridOptions } from "ag-grid-community";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";

import { MarketTransactionsTableProps } from "./MarketTransactionsTable.types";
import styles from "./MarketTransactionsTable.module.scss";

export const MarketTransactionsTable: React.FC<MarketTransactionsTableProps> = ({ className }) => {
  const [rowData] = useState([
    {
      type: "Buy",
      outcome: "Yes",
      total_value: "10245.00 USDT",
      exchange_rate: "34.56 YES",
      account: "something.near",
      price: "0.56",
      time: "5 secs ago",
    },
    {
      type: "Sell",
      outcome: "Yes",
      total_value: "10245.00 USDT",
      exchange_rate: "34.56 YES",
      account: "something.near",
      price: "0.56",
      time: "5 secs ago",
    },
    {
      type: "Transfer",
      outcome: "Yes",
      total_value: "10245.00 USDT",
      exchange_rate: "34.56 YES",
      account: "something.near",
      price: "0.56",
      time: "5 secs ago",
    },
    {
      type: "Claim",
      outcome: "Yes",
      total_value: "10245.00 USDT",
      exchange_rate: "34.56 YES",
      account: "something.near",
      price: "0.56",
      time: "5 secs ago",
    },
  ]);

  const classes = {
    cellClass: [styles["market-transactions-table__cell"]],
    headerClass: [styles["market-transactions-table__header"]],
  };

  const [columnDefs] = useState<GridOptions["columnDefs"]>([
    { field: "type", headerName: "Type", filter: true, flex: 1, ...classes },
    { field: "outcome", headerName: "Outcome", filter: true, flex: 1, ...classes },
    { field: "total_value", headerName: "Total Value", filter: true, flex: 1, ...classes },
    { field: "exchange_rate", headerName: "Exchange Rate", flex: 1, ...classes },
    { field: "account", headerName: "Account", flex: 1, ...classes },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      ...classes,
    },
    { field: "time", headerName: "Time", flex: 1, ...classes },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    [],
  );

  return (
    <Card className={styles["market-transactions-table"]}>
      <Card.Content>
        <Typography.Headline2>Transactions</Typography.Headline2>
        <Card>
          <Card.Content className={styles["market-transactions-table__card-content"]}>
            <div className={clsx(styles["market-transactions-table__grid"], className, "ag-theme-alpine-dark")}>
              <AgGridReact
                rowClass={styles["market-transactions-table__row"]}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows
                rowSelection="multiple"
              />
            </div>
          </Card.Content>
        </Card>
      </Card.Content>
    </Card>
  );
};
