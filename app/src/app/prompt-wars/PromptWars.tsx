/* eslint-disable unicorn/prefer-add-event-listener */
import clsx from "clsx";
import { useEffect, useState } from "react";

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

import styles from "./PromptWars.module.scss";
import { PromptWarsProps } from "./PromptWars.types";

const onNextCountdownComplete = () => {
  console.log("onNextCountdownComplete");
  // @TODO fetch new image
  // labels: 100 USDT
};

export const PromptWars: React.FC<PromptWarsProps> = ({ marketId, className }) => {
  const [isFAQsModalVisible, displayFAQsModal] = useState(false);
  const [isWatchRevealProgressModalVisible, displayWatchRevealProgressModal] = useState(false);

  const { marketContractValues, fetchMarketContractValues, ftTransferCall, sell } =
    useNearPromptWarsMarketContractContext();

  const toast = useToastContext();

  useEffect(() => {
    fetchMarketContractValues();
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

  const onMainCountdownComplete = () => {
    console.log("onMainCountdownComplete");
    fetchMarketContractValues();
  };

  const onRevealCountdownComplete = () => {
    console.log("onRevealCountdownComplete");
    fetchMarketContractValues();
  };

  const onResolutionCountdownComplete = () => {
    console.log("onResolutionCountdownComplete");
    fetchMarketContractValues();
  };

  return (
    <>
      <div className={clsx(styles["prompt-wars"], className)}>
        <MainPanel.Container>
          <div className={styles["prompt-wars__title-row"]}>
            <PromptWarsLogo />
            <div className={styles["prompt-wars__title-row--description"]}>
              <Typography.Description flat>
                Compete against the best prompt engineers
                <br /> writing the prompt that will render the image on display.{" "}
                <Typography.Anchor onClick={onRevealWatchProgressClick} href="#">
                  FAQs
                </Typography.Anchor>
              </Typography.Description>
            </div>
          </div>

          <div className={styles["prompt-wars__game-row"]}>
            <Grid.Row>
              <Grid.Col lg={7} xs={12}>
                <ImgPromptCard
                  marketId={marketId}
                  marketContractValues={marketContractValues}
                  datesElement={<></>}
                  onMainCountdownComplete={onMainCountdownComplete}
                  onNextCountdownComplete={onNextCountdownComplete}
                  onResolutionCountdownComplete={onResolutionCountdownComplete}
                  onClaimDepositUnresolved={onClaimDepositUnresolved}
                  onRevealWatchProgressClick={onRevealWatchProgressClick}
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
        </MainPanel.Container>
      </div>

      {/* @TODO complete the FAQs. labels: 100 USDT */}
      {isFAQsModalVisible && <FaqsModal onClose={onClickCloseFAQsModal} />}

      {isWatchRevealProgressModalVisible && (
        <RevealProgressModal
          onClose={onClickCloseWatchRevealProgressModal}
          onRevealCountdownComplete={onRevealCountdownComplete}
          marketContractValues={marketContractValues}
        />
      )}
    </>
  );
};
