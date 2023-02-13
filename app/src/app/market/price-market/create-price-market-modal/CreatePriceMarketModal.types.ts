import { ReactNode } from "react";

export type CreatePriceMarketModalProps = {
  onClose: () => void;
  children?: ReactNode;
  className?: string;
};

export type CreatePriceMarketModalForm = {
  marketStartDate: string;
  marketStartTime: string;
  marketEndDate: string;
  marketEndTime: string;
};
