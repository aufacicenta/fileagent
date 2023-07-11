import clsx from "clsx";
import { Field, Form as RFForm } from "react-final-form";
import { useState } from "react";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { Icon } from "ui/icon/Icon";
import { PromptWarsMarketContractStatus } from "providers/near/contracts/prompt-wars/prompt-wars.types";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import { useNearWalletSelectorContext } from "hooks/useNearWalletSelectorContext/useNearWalletSelectorContext";
import currency from "providers/currency";
import pulse from "providers/pulse";

import { PromptInputCardProps } from "./PromptInputCard.types";
import styles from "./PromptInputCard.module.scss";

export const PromptInputCard: React.FC<PromptInputCardProps> = ({
  onSubmit,
  className,
  onClickFAQsButton,
  marketContractValues,
}) => {
  const [isNegativePromptFieldVisible, displayNegativePromptField] = useState(false);

  const wallet = useWalletStateContext();
  const nearWalletSelectorContext = useNearWalletSelectorContext();

  const { status, fees, collateralToken } = marketContractValues;

  const isDisabled = status !== PromptWarsMarketContractStatus.OPEN;

  const handleOnDisplayWidgetClick = () => {
    nearWalletSelectorContext.modal?.show();
  };

  return (
    <RFForm
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(styles["prompt-input-card"], className)} withSpotlightEffect>
            <Card.Content>
              <Typography.Headline3 className={styles["prompt-input-card__title"]}>
                Write your prompt down 👇
              </Typography.Headline3>
              <Field
                name="value"
                component="textarea"
                className={clsx(styles["prompt-input-card__input"], "input-field", "materialize-textarea")}
                placeholder="Write your prompt here..."
                disabled={isDisabled}
              />
              <Typography.Description
                onClick={() => displayNegativePromptField(!isNegativePromptFieldVisible)}
                className={styles["prompt-input-card__negative-prompt--trigger"]}
              >
                <Icon name={isNegativePromptFieldVisible ? "icon-chevron-down" : "icon-chevron-right"} /> Add a negative
                prompt
              </Typography.Description>
              <div
                className={clsx(styles["prompt-input-card__negative-prompt"], {
                  [styles["prompt-input-card__negative-prompt--visible"]]: isNegativePromptFieldVisible,
                })}
              >
                <Field
                  name="negative_prompt"
                  component="textarea"
                  className={clsx(
                    styles["prompt-input-card__input"],
                    styles["prompt-input-card__input--hidden"],
                    "input-field",
                    "materialize-textarea",
                  )}
                  placeholder="Write your negative prompt here..."
                  disabled={isDisabled}
                />
              </div>
            </Card.Content>
            <Card.Actions>
              <Typography.Description flat>
                Submitting your prompt will charge USDT{" "}
                {currency.convert.toDecimalsPrecisionString(fees.price, collateralToken.decimals)}{" "}
                <code>{pulse.getConfig().COLLATERAL_TOKENS[0].accountId}</code> from your wallet. This will cover
                storage costs and the submission fee.{" "}
                <Typography.Anchor onClick={onClickFAQsButton} href="#">
                  FAQs
                </Typography.Anchor>
              </Typography.Description>
              {!wallet.isConnected ? (
                <Button color="secondary" variant="outlined" onClick={handleOnDisplayWidgetClick}>
                  Connect to play
                </Button>
              ) : (
                <Button type="submit" disabled={isDisabled}>
                  Submit
                </Button>
              )}
            </Card.Actions>
          </Card>
        </form>
      )}
    />
  );
};
