import { GetStaticPropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { MarketContainer } from "app/dashboard/market/market/MarketContainer";
import { MarketFactoryContract } from "providers/near/contracts/market-factory";

const Market: NextPage = () => (
  <DashboardLayout>
    <MarketContainer />
  </DashboardLayout>
);

export async function getStaticPaths() {
  const marketFactory = await MarketFactoryContract.loadFromGuestConnection();
  const marketsList = await marketFactory.getMarketsList();
  const paths = marketsList?.map((marketId) => ({ params: { marketId } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  await i18n?.reloadResources();

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["swap-card", "common", "head"])),
    },
  };
}

export default Market;
