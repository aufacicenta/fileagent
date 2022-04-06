import Web3 from "web3";
import { Contract, EventData } from "web3-eth-contract";
import { AbiItem } from "web3-utils/types";

import { Provider } from "context/evm-wallet-selector/EVMWalletSelectorContext.types";

import PaymentSplitter from "./PaymentSplitter.json";

export class AirdropContract {
  public contract: Contract;

  constructor(provider: Provider) {
    const web3 = new Web3(provider);
    this.contract = new web3.eth.Contract(PaymentSplitter.abi as AbiItem[], process.env.NEXT_PUBLIC_AIRDROP_CONTRACT);
  }

  async shares(payee: string) {
    try {
      const shares = await this.contract.methods.shares(payee).call();

      return shares;
    } catch {
      return "0.00";
    }
  }

  async released(payee: string) {
    try {
      const released = await this.contract.methods.released(payee).call();

      return released;
    } catch {
      return "0.00";
    }
  }

  release(payee: string) {
    const eventEmitter = this.contract.methods.release(payee).send({ from: payee });

    return eventEmitter;
  }

  subscribeToPaymentReleasedOnce(payee: string, eventHandler: (error: Error, event: EventData) => void) {
    return this.contract.once("PaymentReleased", { filter: { to: payee } }, eventHandler);
  }

  subscribeToPaymentReleased(payee: string) {
    return this.contract.events.PaymentReleased({ filter: { to: payee } });
  }
}
