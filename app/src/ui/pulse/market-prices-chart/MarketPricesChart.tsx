import "chartjs-adapter-moment";
import clsx from "clsx";
import { useEffect } from "react";
import {
  CategoryScale,
  Chart,
  ChartConfiguration,
  DefaultDataPoint,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Filler,
} from "chart.js";
import { flatten, uniq } from "lodash";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import date from "providers/date";
import pulse from "providers/pulse";

import { MarketPricesChartProps } from "./MarketPricesChart.types";
import styles from "./MarketPricesChart.module.scss";

Chart.register(CategoryScale, LinearScale, LineController, PointElement, LineElement, TimeScale, Filler);

// @TODO i18n
export const MarketPricesChart: React.FC<MarketPricesChartProps> = ({ className, marketContractValues }) => {
  useEffect(() => {
    const labels = uniq(
      flatten(
        marketContractValues.outcomeTokens!.map((token) =>
          token.price_history.map((ph) => date.fromTimestamp(ph.timestamp)),
        ),
      ),
    );

    const datasets = marketContractValues.outcomeTokens!.map((token) => ({
      label: marketContractValues.market.options[token.outcome_id],
      data: token.price_history.map((ph) => ({ x: ph.timestamp, y: ph.price })),
      borderColor: pulse.constants.COMPLEMENTARY_COLORS[token.outcome_id],
      backgroundColor: pulse.constants.COMPLEMENTARY_COLORS_RGBA[token.outcome_id],
      fill: true,
    }));

    const data = {
      labels,
      datasets,
    };

    const config: ChartConfiguration<"line", DefaultDataPoint<"line">> = {
      type: "line",
      data,
      options: {
        responsive: true,
        parsing: {
          xAxisKey: "x",
          yAxisKey: "y",
        },
        plugins: {
          tooltip: {
            mode: "index",
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        scales: {
          x: {
            ticks: { source: "labels" },
            title: {
              display: false,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Price",
            },
          },
        },
      },
    };

    const marketChart = new Chart(document.querySelector("#market-chart")! as HTMLCanvasElement, config);

    return () => {
      marketChart.destroy();
    };
  }, []);

  return (
    <Card className={clsx(styles["market-prices-chart"], className)}>
      <Card.Content>
        <Typography.Headline2>Market Chart</Typography.Headline2>
        <canvas id="market-chart" />
      </Card.Content>
    </Card>
  );
};
