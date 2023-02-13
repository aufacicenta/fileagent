import clsx from "clsx";
import { Form as RFForm } from "react-final-form";
import { useTranslation } from "next-i18next";
import { OnChange } from "react-final-form-listeners";
import { useEffect, useState } from "react";

import { Modal } from "ui/modal/Modal";
import { Grid } from "ui/grid/Grid";
import { Form } from "ui/form/Form";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import date from "providers/date";
import { PartialCreatePriceMarketContractArgs } from "context/near/market-factory-contract/NearMarketFactoryContractContext.types";
import { useNearMarketFactoryContractContext } from "context/near/market-factory-contract/useNearMarketFactoryContractContext";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import pulse from "providers/pulse";
import currency from "providers/currency";
import switchboard from "providers/switchboard";

import styles from "./CreatePriceMarketModal.module.scss";
import { CreatePriceMarketModalForm, CreatePriceMarketModalProps } from "./CreatePriceMarketModal.types";

export const CreatePriceMarketModal: React.FC<CreatePriceMarketModalProps> = ({ onClose, className }) => {
  const [marketDescription, setMarketDescription] = useState<string>();
  const [marketEndDate, setMarketEndDate] = useState<string>();
  const [marketEndTime, setMarketEndTime] = useState<string>("12:00");

  const MarketFactoryContract = useNearMarketFactoryContractContext();

  const { t } = useTranslation(["price-market", "common"]);
  const toast = useToastContext();

  const getMarketDescription = async () => {
    const currentPrice = (await switchboard.fetchCurrentPrice(switchboard.jobs.testnet.near.btcUsd)).toFixed(2);

    if (!marketEndDate) {
      setMarketDescription(
        `Will ${pulse.getConfig().priceMarket.defaultBaseCurrency.symbol} be above ${currency.convert.toFormattedString(
          currentPrice,
        )} in ...?`,
      );

      return;
    }

    const marketEndDateTime = date.parse
      .fromDefaultFormat(`${marketEndDate} ${marketEndTime}`)
      .utcOffset(date.constants.DEFAULT_TIMEZONE_OFFSET);

    setMarketDescription(
      `Will ${pulse.getConfig().priceMarket.defaultBaseCurrency.symbol} be above ${currency.convert.toFormattedString(
        currentPrice,
      )} ${date.timeFromNow.asDefault(marketEndDateTime.valueOf())}?`,
    );
  };

  useEffect(() => {
    getMarketDescription();
  }, [marketEndDate, marketEndTime]);

  const onSubmit = async (values: CreatePriceMarketModalForm) => {
    try {
      const startsAt = date.parse
        .fromDefaultFormat(`${values.marketStartDate} ${values.marketStartTime}`)
        .utcOffset(date.constants.DEFAULT_TIMEZONE_OFFSET);

      const endsAt = date.parse
        .fromDefaultFormat(`${values.marketEndDate} ${values.marketEndTime}`)
        .utcOffset(date.constants.DEFAULT_TIMEZONE_OFFSET);

      const resolutionWindow = endsAt.clone().add(5, "minutes");

      const args: PartialCreatePriceMarketContractArgs = {
        startsAt: date.toNanoseconds(startsAt.valueOf()),
        endsAt: date.toNanoseconds(endsAt.valueOf()),
        resolutionWindow: date.toNanoseconds(resolutionWindow.valueOf()),
      };

      // @TODO validate that dates are in the future
      await MarketFactoryContract.createPriceMarket(args);
    } catch {
      toast.trigger({
        variant: "error",
        withTimeout: true,
        title: "Oops, our bad.",
        children: <Typography.Text>While creating the market. Try again?</Typography.Text>,
      });
    }
  };

  const onChangeMarketEndDate = (value: string, mutator: (...args: any[]) => any) => {
    setMarketEndDate(value);
    mutator();
  };

  const onChangeMarketEndTime = (value: string, mutator: (...args: any[]) => any) => {
    setMarketEndTime(value);
    mutator();
  };

  return (
    <Modal
      className={clsx(styles["create-price-market-modal"], className)}
      isOpened
      aria-labelledby="Create Market Modal Window"
      onClose={onClose}
    >
      <RFForm
        onSubmit={onSubmit}
        mutators={{
          setMarketDescription: (_, state, utils) => {
            utils.changeValue(state, "marketDescription", () => marketDescription);
          },
        }}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Header onClose={onClose}>
              <Typography.Headline2 flat>{t("priceMarket.createPriceMarketModal.title")}</Typography.Headline2>
            </Modal.Header>
            <Modal.Content className={styles["create-price-market-modal__modal-content"]}>
              <Card className={styles["create-price-market-modal__market-details-card"]}>
                <Card.Content>
                  <Typography.Headline3>{t("priceMarket.createPriceMarketModal.marketDetails")}</Typography.Headline3>
                  <Grid.Row>
                    <Grid.Col lg={12} xs={12}>
                      <Form.Label htmlFor="marketDescription">
                        {t("priceMarket.createPriceMarketModal.input.descriptionOfTheMarket")}
                      </Form.Label>
                      <Form.TextInput id="marketDescription" type="text" disabled defaultValue={marketDescription} />
                    </Grid.Col>
                  </Grid.Row>
                  <div className={styles["create-price-market-modal__spacer"]} />
                  <Typography.Headline3>
                    {t("priceMarket.createPriceMarketModal.input.marketStartDatetime")}
                  </Typography.Headline3>
                  <Grid.Row>
                    <Grid.Col lg={4} xs={12}>
                      <Form.Label htmlFor="marketStartDate">
                        {t("priceMarket.createPriceMarketModal.input.marketStartDate")}
                      </Form.Label>
                      <Form.TextInput id="marketStartDate" type="date" />
                    </Grid.Col>
                    <Grid.Col lg={3} xs={12}>
                      <Form.Label htmlFor="marketStartTime">
                        {t("priceMarket.createPriceMarketModal.input.marketStartTime")}
                      </Form.Label>
                      <Form.TextInput id="marketStartTime" type="time" />
                    </Grid.Col>
                  </Grid.Row>
                  <div className={styles["create-price-market-modal__spacer"]} />
                  <Typography.Headline3>
                    {t("priceMarket.createPriceMarketModal.input.marketEndDatetime")}
                  </Typography.Headline3>
                  <Grid.Row>
                    <Grid.Col lg={4} xs={12}>
                      <Form.Label htmlFor="marketEndDate">
                        {t("priceMarket.createPriceMarketModal.input.marketEndDate")}
                      </Form.Label>
                      <Form.TextInput id="marketEndDate" type="date" />
                      <OnChange name="marketEndDate">
                        {(value) => onChangeMarketEndDate(value, form.mutators.setMarketDescription)}
                      </OnChange>
                    </Grid.Col>
                    <Grid.Col lg={3} xs={12}>
                      <Form.Label htmlFor="marketEndTime">
                        {t("priceMarket.createPriceMarketModal.input.marketEndTime")}
                      </Form.Label>
                      <Form.TextInput id="marketEndTime" type="time" />
                      <OnChange name="marketEndTime">
                        {(value) => onChangeMarketEndTime(value, form.mutators.setMarketDescription)}
                      </OnChange>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Content>
              </Card>
            </Modal.Content>
            <Modal.Actions>
              <Button type="submit">{t("priceMarket.createPriceMarketModal.form.submit")}</Button>
            </Modal.Actions>
          </form>
        )}
      />
    </Modal>
  );
};
