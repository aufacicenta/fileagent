import clsx from "clsx";
import { Field, Form as RFForm } from "react-final-form";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";

import { PromptInputCardProps } from "./PromptInputCard.types";
import styles from "./PromptInputCard.module.scss";

export const PromptInputCard: React.FC<PromptInputCardProps> = ({ onSubmit, className }) => (
  <RFForm
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Card className={clsx(styles["prompt-input-card"], className)}>
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
          </Card.Content>
          <Card.Actions>
            <Typography.Description flat>
              Submitting your prompt will charge 10 USDT from your wallet. This will cover storage costs and the
              submission fee.{" "}
              <Button size="xs" variant="outlined" color="secondary">
                FAQs
              </Button>
            </Typography.Description>
            <Button type="submit">Submit</Button>
          </Card.Actions>
        </Card>
      </form>
    )}
  />
);
