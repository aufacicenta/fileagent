import dynamic from "next/dynamic";

import { LatestTrendsProps } from "./LatestTrends.types";

const LatestTrends = dynamic<LatestTrendsProps>(() => import("./LatestTrends").then((mod) => mod.LatestTrends), {
  ssr: false,
});

export const LatestTrendsContainer = () => <LatestTrends />;
