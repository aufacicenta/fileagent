/* eslint-disable unicorn/prefer-add-event-listener */
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { PromptWarsLogo } from "ui/icons/PromptWarsLogo";
import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { ImgPromptCard } from "ui/pulse/img-prompt-card/ImgPromptCard";
import { GenericLoader } from "ui/generic-loader/GenericLoader";
import { PromptInputCard } from "ui/pulse/prompt-input-card/PromptInputCard";
import { FaqsModal } from "ui/pulse/prompt-wars/faqs-modal/FaqsModal";
import { useNearPromptWarsMarketContractContext } from "context/near/prompt-wars-market-contract/useNearPromptWarsMarketContractContext";
import { RevealProgressModal } from "ui/pulse/prompt-wars/reveal-progress-modal/RevealProgressModal";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Prompt } from "providers/near/contracts/prompt-wars/prompt-wars.types";
import { ResultsModal } from "ui/pulse/prompt-wars/results-modal/ResultsModal";
import { useNearMarketFactoryContractContext } from "context/near/market-factory-contract/useNearMarketFactoryContractContext";
import { Footer } from "ui/footer/Footer";

import styles from "./PromptWars.module.scss";
import { PromptWarsProps } from "./PromptWars.types";

export const PromptWars: React.FC<PromptWarsProps> = ({ marketId, className }) => {
  const [isFAQsModalVisible, displayFAQsModal] = useState(false);
  const [isWatchRevealProgressModalVisible, displayWatchRevealProgressModal] = useState(false);
  const [isResultsModalVisible, displayResultsModal] = useState(false);

  const { t } = useTranslation(["prompt-wars"]);

  const { marketContractValues, fetchMarketContractValues, ftTransferCall, sell } =
    useNearPromptWarsMarketContractContext();

  const { fetchLatestPriceMarket } = useNearMarketFactoryContractContext();

  const toast = useToastContext();

  useEffect(() => {
    fetchMarketContractValues();
  }, [marketId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketContractValues();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [marketId]);

  if (!marketContractValues) {
    // @TODO render PriceMarket skeleton template
    return <GenericLoader />;
  }

  const onSubmit = async (prompt: Prompt) => {
    if (marketContractValues.isOver) {
      toast.trigger({
        variant: "error",
        // @TODO i18n
        title: "Market is over",
        children: <Typography.Text>Cannot purchase market options on this event.</Typography.Text>,
      });

      return;
    }

    await ftTransferCall(prompt);
  };

  const onClaimDepositUnresolved = async () => {
    await sell();
  };

  const onClaimDepositResolved = async () => {
    await sell();
  };

  const onClickCloseFAQsModal = () => {
    displayFAQsModal(false);
  };

  const onClickFAQsButton = () => {
    displayFAQsModal(true);
  };

  const onClickCloseWatchRevealProgressModal = () => {
    displayWatchRevealProgressModal(false);
  };

  const onRevealWatchProgressClick = () => {
    displayWatchRevealProgressModal(true);
  };

  const onClickCloseResultsModal = () => {
    displayResultsModal(false);
  };

  const onClickSeeResults = () => {
    displayResultsModal(true);
  };

  const onNextGameCountdownComplete = () => {
    setTimeout(() => {
      fetchLatestPriceMarket();
    }, 20000);
  };

  return (
    <>
      <div className={clsx(styles["prompt-wars"], className)}>
        <MainPanel.Container>
          <Grid.Container>
            <div className={styles["prompt-wars__title-row"]}>
              <PromptWarsLogo />
              <div className={styles["prompt-wars__title-row--description"]}>
                <Typography.Description flat>
                  {t("promptWars.description")}
                  <Typography.Anchor onClick={onClickFAQsButton} href="#">
                    {t("promptWars.faqs")}
                  </Typography.Anchor>
                </Typography.Description>
              </div>
            </div>

            <div className={styles["prompt-wars__game-row"]}>
              <Grid.Row>
                <Grid.Col lg={7} xs={12} className={styles["prompt-wars__game-row--col-left"]}>
                  <ImgPromptCard
                    marketId={marketId}
                    marketContractValues={marketContractValues}
                    datesElement={<></>}
                    onClaimDepositUnresolved={onClaimDepositUnresolved}
                    onRevealWatchProgressClick={onRevealWatchProgressClick}
                    onClickSeeResults={onClickSeeResults}
                    onClaimDepositResolved={onClaimDepositResolved}
                    onNextGameCountdownComplete={onNextGameCountdownComplete}
                  />
                </Grid.Col>
                <Grid.Col lg={5} xs={12}>
                  <PromptInputCard
                    onSubmit={onSubmit}
                    onClickFAQsButton={onClickFAQsButton}
                    marketContractValues={marketContractValues}
                  />
                </Grid.Col>
              </Grid.Row>
            </div>
          </Grid.Container>
        </MainPanel.Container>
        <Footer />
      </div>

      {/* @TODO complete the FAQs. labels: 100 USDT */}
      {isFAQsModalVisible && <FaqsModal onClose={onClickCloseFAQsModal} />}

      {isWatchRevealProgressModalVisible && (
        <RevealProgressModal
          onClose={onClickCloseWatchRevealProgressModal}
          marketContractValues={marketContractValues}
        />
      )}

      {isResultsModalVisible && (
        <ResultsModal onClose={onClickCloseResultsModal} marketContractValues={marketContractValues} />
      )}
    </>
  );
};
