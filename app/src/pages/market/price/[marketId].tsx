import { GetServerSidePropsContext, NextPage } from "next";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { PriceMarketContainer } from "app/market/price-market/PriceMarketContainer";
import { PriceMarketContainerProps } from "app/market/price-market/PriceMarket.types";
import { PriceMarketContract } from "providers/near/contracts/price-market";

const Page: NextPage<PriceMarketContainerProps> = ({ marketId, head }) => (
  <DashboardLayout>
    <Head>
      <title>{head.title}</title>
      <meta property="og:title" content={head.title} />
      <meta name="description" content={head.description} />
      <meta property="og:description" content={head.description} />
      <meta property="og:url" content={head.url} />
    </Head>

    <PriceMarketContainer marketId={marketId} head={head} />
  </DashboardLayout>
);

export const getServerSideProps = async ({ locale, params }: GetServerSidePropsContext) => {
  await i18n?.reloadResources();

  const marketId = params?.marketId;

  const contract = await PriceMarketContract.loadFromGuestConnection(marketId as string);
  const market = await contract.getMarketData();
  const price = await contract.getPricingData();

  const head: PriceMarketContainerProps["head"] = {
    title: "Pulse Price Markets",
    description: `${PriceMarketContract.getDescription(market, price!)} —&nbsp;Bet now!`,
    url: `https://app.pulsemarkets.org/market/price/${marketId}`,
  };

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head", "home", "swap-card", "price-market"])),
      marketId,
      head,
    },
  };
};

export default Page;
