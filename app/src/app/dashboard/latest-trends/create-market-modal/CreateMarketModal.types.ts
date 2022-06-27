import { ReactNode } from "react";

export type CreateMarketModalProps = {
  children?: ReactNode;
  className?: string;
  onClose: () => void;
};

export type CreateMarketModalForm = {
  collateralToken: string;
  defaultMarketOption: string;
  marketCategory: string;
  marketDescription: string;
  marketStartDate: string;
  marketStartTime: string;
  marketEndDate: string;
  marketEndTime: string;
  marketEndTimezoneOffset: string;
  marketOptions: Array<string>;
};
