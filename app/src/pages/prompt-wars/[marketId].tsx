import { GetServerSidePropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { PriceMarketContainerProps } from "app/market/price-market/PriceMarket.types";
import { PromptWarsContainer } from "app/prompt-wars/PromptWarsContainer";
import { PromptWarsContainerProps } from "app/prompt-wars/PromptWars.types";

const Page: NextPage<PriceMarketContainerProps> = ({ marketId, head }) => (
  <DashboardLayout>
    <Head>
      <title>{head.title}</title>
      <meta property="og:title" content={head.title} />
      <meta name="description" content={head.description} />
      <meta property="og:description" content={head.description} />
      <meta property="og:url" content={head.url} />
    </Head>

    <PromptWarsContainer marketId={marketId} head={head} />
  </DashboardLayout>
);

export const getServerSideProps = async ({ locale, params }: GetServerSidePropsContext) => {
  await i18n?.reloadResources();

  const marketId = params?.marketId;

  const head: PromptWarsContainerProps["head"] = {
    title: "Prompt Wars",
    description: `Earn USDT from your prompt engineering skills competing with the world best!`,
    url: `https://app.pulsemarkets.org/prompt-wars/${marketId}`,
  };

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head", "home", "swap-card"])),
      marketId,
      head,
    },
  };
};

export default Page;
