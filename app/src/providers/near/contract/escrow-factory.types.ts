export type EscrowFactoryValues = {
  conditionalEscrowContractsList: string[];
};

export type EscrowFactoryMethods = {
  get_conditional_escrow_contracts_list: () => Promise<string[]>;
};
