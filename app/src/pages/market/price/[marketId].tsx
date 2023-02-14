import { GetServerSidePropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { PriceMarketContainer } from "app/market/price-market/PriceMarketContainer";
import { PriceMarketContainerProps } from "app/market/price-market/PriceMarket.types";

// @TODO Head SEO metatags
const Page: NextPage<PriceMarketContainerProps> = ({ marketId }) => (
  <DashboardLayout>
    <PriceMarketContainer marketId={marketId} />
  </DashboardLayout>
);

export const getServerSideProps = async ({ locale, params }: GetServerSidePropsContext) => {
  await i18n?.reloadResources();

  const marketId = params?.marketId;

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head", "home", "swap-card", "price-market"])),
      marketId,
    },
  };
};

export default Page;
