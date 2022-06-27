import { Contract } from "near-api-js";

import { EscrowFactoryMethods, EscrowFactoryValues } from "./escrow-factory.types";

export const VIEW_METHODS = ["get_conditional_escrow_contracts_list"];

export const CHANGE_METHODS = [];

export const getDefaultContractValues = (): EscrowFactoryValues => ({
  conditionalEscrowContractsList: [],
});

export const getConditionalEscrowContractsList = async (
  contract: Contract & EscrowFactoryMethods,
): Promise<EscrowFactoryValues["conditionalEscrowContractsList"]> => {
  const conditionalEscrowContractsList = await contract.get_conditional_escrow_contracts_list();

  return conditionalEscrowContractsList;
};
