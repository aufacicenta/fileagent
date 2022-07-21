import { GetServerSidePropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { MarketContainer } from "app/dashboard/market/market/MarketContainer";
import { MarketContainerProps } from "app/dashboard/market/market/Market.types";

const Market: NextPage<MarketContainerProps> = ({ marketId }) => (
  <DashboardLayout>
    <MarketContainer marketId={marketId} />
  </DashboardLayout>
);

export async function getServerSideProps({ locale, defaultLocale, params }: GetServerSidePropsContext) {
  const marketId = params?.marketId;
  await i18n?.reloadResources();

  return {
    props: {
      marketId,
      ...(await serverSideTranslations(locale || defaultLocale!, ["swap-card", "common", "head"])),
    },
  };
}

export default Market;
