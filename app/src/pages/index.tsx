import { GetStaticPropsContext, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n } from "next-i18next";

import { HomeContainer } from "app/home/home/HomeContainer";
import { AppLayout } from "layouts/app-layout/AppLayout";

const Index: NextPage = () => (
  <AppLayout>
    <HomeContainer />
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
