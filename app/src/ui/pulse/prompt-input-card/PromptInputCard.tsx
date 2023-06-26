import clsx from "clsx";
import { Field, Form as RFForm } from "react-final-form";
import { useState } from "react";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { Icon } from "ui/icon/Icon";

import { PromptInputCardProps } from "./PromptInputCard.types";
import styles from "./PromptInputCard.module.scss";

export const PromptInputCard: React.FC<PromptInputCardProps> = ({ onSubmit, className }) => {
  const [isNegativePromptFieldVisible, displayNegativePromptField] = useState(false);

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
                name="prompt"
                component="textarea"
                className={clsx(styles["prompt-input-card__input"], "input-field", "materialize-textarea")}
                placeholder="Write your prompt here..."
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
                  name="negativePrompt"
                  component="textarea"
                  className={clsx(
                    styles["prompt-input-card__input"],
                    styles["prompt-input-card__input--hidden"],
                    "input-field",
                    "materialize-textarea",
                  )}
                  placeholder="Write your negative prompt here..."
                />
              </div>
            </Card.Content>
            <Card.Actions>
              <Typography.Description flat>
                Submitting your prompt will charge 10 USDT from your wallet. This will cover storage costs and the
                submission fee. <Typography.Anchor>FAQs</Typography.Anchor>
              </Typography.Description>
              <Button type="submit">Submit</Button>
            </Card.Actions>
          </Card>
        </form>
      )}
    />
  );
};
