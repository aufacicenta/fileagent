import clsx from "clsx";
import { Form as RFForm } from "react-final-form";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { Form } from "ui/form/Form";
import { Button } from "ui/button/Button";

import { SwapCardProps } from "./SwapCard.types";
import styles from "./SwapCard.module.scss";

export const SwapCard: React.FC<SwapCardProps> = ({ className, onSubmit }) => (
  <RFForm
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Card className={clsx(styles["swap-card"], className)}>
          <Card.Content>
            <Typography.Headline2 className={styles["swap-card__buy-sell"]}>
              Buy &amp; Sell Outcomes
            </Typography.Headline2>
            <Typography.Description className={styles["swap-card__balance"]}>Balance: 0.00</Typography.Description>
            <div className={styles["swap-card__from"]}>
              <div className={styles["swap-card__from--name-price"]}>
                <Typography.Text>Wrapped NEAR</Typography.Text>
                <Typography.Text>wNEAR 1.23</Typography.Text>
              </div>
              <div className={styles["swap-card__from--token-amount"]}>
                <Form.Label id="marketOptions" className={styles["swap-card__from--label"]}>
                  <Icon name="icon-near" />
                  <Typography.Text flat>wNEAR</Typography.Text>
                </Form.Label>
                <Form.TextInput
                  id="fromTokenAmount"
                  type="text"
                  placeholder="0.00"
                  className={styles["swap-card__from--amount-input"]}
                />
              </div>
              <div className={styles["swap-card__from--switch"]}>
                <div>
                  <Icon name="icon-tab" />
                </div>
              </div>
            </div>
            <Typography.Description className={styles["swap-card__balance"]}>Balance: 0.00</Typography.Description>
            <div className={styles["swap-card__to"]}>
              <div className={styles["swap-card__to--name-price"]}>
                <Typography.Text>Yes</Typography.Text>
                <Typography.Text>OT 0.57</Typography.Text>
              </div>
              <div className={styles["swap-card__to--token-amount"]}>
                <Form.Label id="marketOptions" className={styles["swap-card__to--label"]}>
                  <Icon name="icon-near" />
                  <Typography.Text flat>YES</Typography.Text>
                </Form.Label>
                <Form.TextInput
                  id="toTokenAmount"
                  type="text"
                  placeholder="0.00"
                  className={styles["swap-card__to--amount-input"]}
                />
              </div>
            </div>
            <Typography.Description className={styles["swap-card__overview"]}>Overview</Typography.Description>
            <div className={styles["swap-card__overview-card"]}>
              <div className={styles["swap-card__overview-card--row"]}>
                <Typography.Text flat>Rate</Typography.Text>
                <Typography.Text flat>0 wNEAR / YES</Typography.Text>
              </div>
              <div className={styles["swap-card__overview-card--row"]}>
                <Typography.Text flat>Inverse Rate</Typography.Text>
                <Typography.Text flat>0 YES / wNEAR</Typography.Text>
              </div>
              <div className={styles["swap-card__overview-card--row"]}>
                <Typography.Text flat>Estimated Fee</Typography.Text>
                <Typography.Text flat>0 wNEAR</Typography.Text>
              </div>
            </div>
            <Button fullWidth>Swap</Button>
          </Card.Content>
        </Card>
      </form>
    )}
  />
);
