import clsx from "clsx";
import { useEffect, useState } from "react";

import { Grid } from "ui/grid/Grid";
import { WalletSelectorNavbar } from "ui/wallet-selector-navbar/WalletSelectorNavbar";
import { useEvmContract } from "hooks/useEVMContract/useEvmContract";
import { useWalletSelectorContext } from "hooks/useWalletSelectorContext/useWalletSelectorContext";
import { Button } from "ui/button/Button";
import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";
import { GenericLoader } from "ui/generic-loader/GenericLoader";
import { Icon } from "ui/icon/Icon";
import { Modal } from "ui/modal/Modal";
import { MetamaskLogo } from "ui/icons/MetamaskLogo";

import { HomeProps } from "./Home.types";
import styles from "./Home2.module.scss";

export const Home2: React.FC<HomeProps> = ({ className }) => {
  const [contractData, setContractData] = useState<{ shares: string; released: string }>({
    shares: "0.00",
    released: "0.00",
  });
  const [loading, setLoading] = useState(false);
  const [isInstructionsModalVisible, setIsInstructionsModalVisible] = useState(false);

  const contract = useEvmContract();
  const wallet = useWalletSelectorContext();
  const toast = useToastContext();

  useEffect(() => {
    if (!contract) {
      return;
    }

    (async () => {
      const shares = await contract.shares(wallet.address!);
      const released = await contract.released(wallet.address!);

      setContractData({ shares, released });
    })();
  }, [contract, toast, wallet.address]);

  const handleOnClaimClick = async () => {
    if (!contract) return;

    contract
      .release(wallet.address!)
      .on("sending", () => {
        setLoading(true);
      })
      .on("receipt", () => {
        setLoading(false);

        toast.trigger({
          title: "Transaction Completed",
          variant: "info",
          position: "bottom",
          children: <Typography.Text>The transaction was completed successfully</Typography.Text>,
        });
      })
      .on("error", () => {
        setLoading(false);

        toast.trigger({
          title: "Error",
          variant: "error",
          position: "bottom",
          children: (
            <Typography.Text>
              Something went wrong while claiming your available Aurora ETH. Please try again.
            </Typography.Text>
          ),
        });
      });
  };

  const handleOnAddNetClick = async () => {
    const auroraMainnetData = {
      chainId: "0x4E454152",
      chainName: "Aurora Mainnet",
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.aurora.dev"],
      blockExplorerUrls: ["https://aurorascan.dev/"],
    };

    try {
      await wallet?.context?.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: auroraMainnetData.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        wallet.context.provider
          .request({
            method: "wallet_addEthereumChain",
            params: [auroraMainnetData],
          })
          .catch((error: any) => {
            if (error.code !== 4001) {
              setIsInstructionsModalVisible(true);
            }
          });
      }
    }
  };

  const getClaimAction = () => {
    if (Number(contractData.shares) && Number(contractData.released) === 0) {
      return (
        <Button variant="gradient" onClick={handleOnClaimClick}>
          Claim
        </Button>
      );
    }

    return (
      <div className={styles["home__no-claim"]}>
        <Icon className={styles["home__no-claim--warning"]} name="icon-warning" />
        <Typography.Headline3>Sorry</Typography.Headline3>
        <Typography.Text>
          Account {wallet.address}
          <br />
          has no available claim.
        </Typography.Text>
      </div>
    );
  };

  if (loading) {
    return <GenericLoader />;
  }

  return (
    <>
      <WalletSelectorNavbar />
      <div className={clsx(styles.home, className)}>
        <section id="intro" className={clsx(styles.home__intro)}>
          <div className={styles["home__intro--linear-gradient"]}>
            <div />
          </div>
          <div>
            <Grid.Container>
              <Grid.Row>
                <Grid.Col lg={6} offset={{ lg: 3 }}>
                  <div className={styles["home__intro--box"]}>
                    <Typography.Headline1 className={styles["home__intro--headline"]}>Airdrop</Typography.Headline1>
                    <Typography.Text>Claim Aurora ETH</Typography.Text>
                    {wallet.address && getClaimAction()}
                  </div>
                  {wallet?.context.provider && (
                    <Button variant="text" color="secondary" size="xs" onClick={handleOnAddNetClick}>
                      <MetamaskLogo className={styles.home__metamask} /> Connect to Aurora Mainnet
                    </Button>
                  )}
                </Grid.Col>
              </Grid.Row>
            </Grid.Container>
          </div>
        </section>
      </div>

      {isInstructionsModalVisible && (
        <Modal
          isOpened={isInstructionsModalVisible}
          onClose={() => setIsInstructionsModalVisible(false)}
          aria-labelledby="instructions modal"
        >
          <Modal.Header onClose={() => setIsInstructionsModalVisible(false)}>
            <Typography.TextLead flat>Set your wallet to Aurora Mainnet</Typography.TextLead>
          </Modal.Header>
          <Modal.Content>
            <Typography.Text>
              Follow{" "}
              <Typography.Anchor
                href="https://doc.aurora.dev/getting-started/network-endpoints/#mainnet"
                target="_blank"
              >
                these instructions
              </Typography.Anchor>
              , or
            </Typography.Text>
            <Typography.Text flat>Network: Aurora Mainnet</Typography.Text>
            <Typography.Text flat>Chain ID: 1313161554</Typography.Text>
            <Typography.Text flat>Endpoint URL: https://mainnet.aurora.dev</Typography.Text>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
};
