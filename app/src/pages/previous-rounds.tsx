import { GetServerSidePropsContext, NextPage } from "next";
import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { AccountId } from "providers/near/contracts/market/market.types";
import pulse from "providers/pulse";
import { PreviousRoundsContainer } from "app/prompt-wars/previous-rounds/PreviousRoundsContainer";
import { PromptWarsMarketFactory } from "providers/near/contracts/prompt-wars-market-factory/contract";

const Index: NextPage<{ marketId: AccountId; markets: Array<AccountId> }> = ({ marketId, markets }) => {
  const { t } = useTranslation("head");

  return (
    <DashboardLayout marketId={marketId}>
      <Head>
        <title>{t("head.og.title")}</title>
        <meta name="description" content={t("head.og.description")} />
        <meta property="og:title" content={t("head.og.title")} />
        <meta property="og:description" content={t("head.og.description")} />
        <meta property="og:url" content="https://app.pulsemarkets.org/" />
      </Head>

      <PreviousRoundsContainer markets={markets} />
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => {
  await i18n?.reloadResources();

  const marketId = await pulse.promptWars.getLatestMarketId();
  const markets = await PromptWarsMarketFactory.get_markets_list();
  markets?.reverse();

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head", "prompt-wars"])),
      marketId,
      markets,
    },
  };
};

export default Index;
