import { ReactNode } from "react";

export type AuthorizationContextControllerProps = {
  children: ReactNode;
};

export type AuthorizationContextType = {
  verifyDropboxESignAuthorization: () => Promise<void>;
};
