import clsx from "clsx";
import { Field, Form as RFForm } from "react-final-form";
import { useEffect } from "react";

import { MainPanel } from "ui/mainpanel/MainPanel";
import { PromptWarsLogo } from "ui/icons/PromptWarsLogo";
import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { ImgPromptCard } from "ui/pulse/img-prompt-card/ImgPromptCard";
import { useNearMarketContractContext } from "context/near/market-contract/useNearMarketContractContext";
import { GenericLoader } from "ui/generic-loader/GenericLoader";

import { PromptWarsProps } from "./PromptWars.types";
import styles from "./PromptWars.module.scss";

const onSubmit = async () => undefined;

export const PromptWars: React.FC<PromptWarsProps> = ({ marketId, className }) => {
  const { marketContractValues, fetchMarketContractValues } = useNearMarketContractContext();

  useEffect(() => {
    fetchMarketContractValues();
  }, [marketId]);

  if (!marketContractValues) {
    // @TODO render PriceMarket skeleton template
    return <GenericLoader />;
  }

  return (
    <div className={clsx(styles["prompt-wars"], className)}>
      <MainPanel.Container>
        <div className={styles["prompt-wars__title-row"]}>
          <PromptWarsLogo />
          <div className={styles["prompt-wars__title-row--description"]}>
            <Typography.Description flat>
              Compete against the best prompt engineers
              <br /> writing the prompt that will render the image on display.{" "}
              <Button size="xs" variant="outlined" color="secondary">
                FAQs
              </Button>
            </Typography.Description>
          </div>
        </div>

        <div className={styles["prompt-wars__game-row"]}>
          <Grid.Row>
            <Grid.Col lg={7} xs={12}>
              <ImgPromptCard marketId={marketId} marketContractValues={marketContractValues} datesElement={<></>} />
            </Grid.Col>
            <Grid.Col lg={5} xs={12}>
              <Card>
                <Card.Content>
                  <Card>
                    <Card.Content>
                      <Typography.Headline3 className={styles["prompt-wars__prompt-card--title"]}>
                        Write your prompt down 👇
                      </Typography.Headline3>
                      <RFForm
                        onSubmit={onSubmit}
                        render={({ handleSubmit }) => (
                          <form onSubmit={handleSubmit}>
                            <Field
                              name="prompt"
                              component="textarea"
                              className={clsx(
                                styles["prompt-wars__prompt-card--input"],
                                "input-field",
                                "materialize-textarea",
                              )}
                            />
                          </form>
                        )}
                      />
                    </Card.Content>
                  </Card>
                </Card.Content>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </div>
      </MainPanel.Container>
    </div>
  );
};
