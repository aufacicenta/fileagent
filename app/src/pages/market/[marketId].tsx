import { GetStaticPropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { MarketContainer } from "app/dashboard/market/market/MarketContainer";

const Market: NextPage = () => (
  <DashboardLayout>
    <MarketContainer />
  </DashboardLayout>
);

export async function getStaticPaths() {
  return {
    paths: [{ params: { marketId: "id" } }],
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
