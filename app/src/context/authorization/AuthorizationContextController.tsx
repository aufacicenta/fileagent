import React, { useState } from "react";
import { OAuthTokenStoreKey } from "api/oauth/oauth.types";
import Cookies from "js-cookie";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";

import { AccessTokens, AuthorizationContextControllerProps } from "./AuthorizationContext.types";
import { AuthorizationContext } from "./AuthorizationContext";

export const AuthorizationContextController = ({ children }: AuthorizationContextControllerProps) => {
  const [accessTokens, setAccessTokens] = useState<AccessTokens>({});

  const toast = useToastContext();

  const verifyDropboxESignAuthorization = async () => {
    try {
      const dropboxESignAuthResponse = Cookies.get(OAuthTokenStoreKey.dropbox_esign);

      const value = JSON.parse(dropboxESignAuthResponse!);

      setAccessTokens((prev) => ({
        ...prev,
        [OAuthTokenStoreKey.dropbox_esign]: value.access_token,
      }));

      toast.trigger({
        title: "Authorization successful",
        children: <Typography.Text>You are now authorized to use Dropbox Sign™.</Typography.Text>,
        variant: "confirmation",
        withTimeout: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const props = {
    verifyDropboxESignAuthorization,
    accessTokens,
  };

  return <AuthorizationContext.Provider value={props}>{children}</AuthorizationContext.Provider>;
};
