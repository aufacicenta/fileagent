import { GetStaticPropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { HomeContainer } from "app/home/HomeContainer";

const Index: NextPage = () => (
  <DashboardLayout>
    <HomeContainer />
  </DashboardLayout>
);

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  await i18n?.reloadResources();

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head", "home"])),
    },
  };
};

export default Index;
