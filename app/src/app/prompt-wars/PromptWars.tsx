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

import { PromptWarsProps } from "./PromptWars.types";
import styles from "./PromptWars.module.scss";

const onSubmit = async () => undefined;

const onNextCountdownComplete = () => {
  console.log("onNextCountdownComplete");
  // @TODO fetch new image
  // labels: 100 USDT
};

const onClaimDepositUnresolved = () => {
  // @TODO call sell on the prompt wars contract to get the deposit back
  // labels: 100 USDT
};

export const PromptWars: React.FC<PromptWarsProps> = ({ marketId, className }) => {
  const [isFAQsModalVisible, displayFAQsModal] = useState(false);
  const [isWatchRevealProgressModalVisible, displayWatchRevealProgressModal] = useState(false);

  const { marketContractValues, fetchMarketContractValues } = useNearPromptWarsMarketContractContext();

  useEffect(() => {
    fetchMarketContractValues();
  }, [marketId]);

  if (!marketContractValues) {
    // @TODO render PriceMarket skeleton template
    return <GenericLoader />;
  }

  const onClickCloseFAQsModal = () => {
    displayFAQsModal(false);
  };

  const onClickFAQsButton = () => {
    displayFAQsModal(true);
  };

  const onClickCloseWatchRevealProgressModal = () => {
    displayWatchRevealProgressModal(false);
  };

  const onClickWatchRevealProgressButton = () => {
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
                <Typography.Anchor onClick={onClickFAQsButton} href="#">
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
                  onRevealWatchProgressClick={onClickWatchRevealProgressButton}
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
