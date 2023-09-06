import { OAuthTokenStoreKey } from "api/oauth/oauth.types";
import { ReactNode } from "react";

export type AccessTokens = {
  [OAuthTokenStoreKey.dropbox_esign]?: string;
};

export type AuthorizationContextControllerProps = {
  children: ReactNode;
};

export type AuthorizationContextType = {
  accessTokens: AccessTokens;
  verifyDropboxESignAuthorization: () => Promise<void>;
};
