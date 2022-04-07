import { GetStaticPropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { AppLayout } from "layouts/app-layout/AppLayout";
import { LatestTrendsContainer } from "app/dashboard/latest-trends/latest-trends/LatestTrendsContainer";

const Index: NextPage = () => (
  <AppLayout>
    <LatestTrendsContainer />
  </AppLayout>
);

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  await i18n?.reloadResources();

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head"])),
    },
  };
};

export default Index;
