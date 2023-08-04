import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { Button } from "../button/Button";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useNearWalletSelectorContext } from "hooks/useNearWalletSelectorContext/useNearWalletSelectorContext";
import near from "providers/near";
import { useWalletStateContext } from "hooks/useWalletStateContext/useWalletStateContext";
import pulse from "providers/pulse";
import { CollateralTokenBalance } from "ui/pulse/market-card/collateral-token-balance/CollateralTokenBalance";
import { useNearPromptWarsMarketContractContext } from "context/near/prompt-wars-market-contract/useNearPromptWarsMarketContractContext";

import { WalletSelectorProps } from "./WalletSelector.types";
import styles from "./WalletSelector.module.scss";

import "@near-wallet-selector/modal-ui/styles.css";

export const WalletSelector: React.FC<WalletSelectorProps> = ({ className }) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  const { marketId } = useNearPromptWarsMarketContractContext();

  const nearWalletSelectorContext = useNearWalletSelectorContext();

  const wallet = useWalletStateContext();

  useEffect(() => {
    if (!nearWalletSelectorContext.selector) {
      return;
    }

    nearWalletSelectorContext.initModal(near.getConfig().factoryWalletId);
  }, [nearWalletSelectorContext.selector]);

  const handleOnConnectWalletClick = () => {
    nearWalletSelectorContext.signOut();
    setIsWidgetVisible(false);
  };

  const handleOnDisplayWidgetClick = () => {
    if (wallet.isConnected) {
      setIsWidgetVisible(!isWidgetVisible);
    } else {
      nearWalletSelectorContext.modal?.show();
    }
  };

  const { t } = useTranslation(["prompt-wars"]);

  return (
    <div className={clsx(styles["wallet-selector"], className)}>
      <Button
        color="primary"
        variant="outlined"
        onClick={handleOnDisplayWidgetClick}
        rightIcon={<Icon name={wallet.address ? "icon-power" : "icon-power-crossed"} />}
        className={styles["wallet-selector__button"]}
        size="s"
      >
        {wallet.isConnected ? (
          <Typography.Text inline truncate flat>
            {wallet.address}
          </Typography.Text>
        ) : (
          "Connect Wallet"
        )}
      </Button>
      {isWidgetVisible && (
        <>
          <div
            className={styles["wallet-selector__widget--backdrop"]}
            onClick={() => setIsWidgetVisible(!isWidgetVisible)}
            role="presentation"
          />
          <div className={styles["wallet-selector__widget"]}>
            <div className={styles["wallet-selector__balance"]}>
              <Typography.Description>Native Balance</Typography.Description>
              <Typography.Text>{wallet.balance}</Typography.Text>
              <Typography.Description>
                {t("promptWars.balance")} <code>@{pulse.getDefaultCollateralToken().accountId}</code>
              </Typography.Description>
              <Typography.Text>
                <CollateralTokenBalance
                  accountId={wallet.address || marketId}
                  contractAddress={pulse.getDefaultCollateralToken().accountId}
                />
              </Typography.Text>
              <Typography.MiniDescription flat>
                <Typography.Anchor href={`${wallet.explorer}/accounts/${wallet.address}`} target="_blank">
                  {wallet.isConnected && wallet.address}
                </Typography.Anchor>
              </Typography.MiniDescription>
            </div>
            <div className={styles["wallet-selector__connect"]}>
              <Button size="xs" color="primary" onClick={handleOnConnectWalletClick}>
                {wallet.isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
