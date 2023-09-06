import React from "react";
import { OAuthTokenStoreKey } from "api/oauth/oauth.types";
import Cookies from "js-cookie";

import { useToastContext } from "hooks/useToastContext/useToastContext";
import { Typography } from "ui/typography/Typography";

import { AuthorizationContextControllerProps } from "./AuthorizationContext.types";
import { AuthorizationContext } from "./AuthorizationContext";

export const AuthorizationContextController = ({ children }: AuthorizationContextControllerProps) => {
  const toast = useToastContext();

  const verifyDropboxESignAuthorization = async () => {
    try {
      const dropboxESignAuthResponse = Cookies.get(OAuthTokenStoreKey.dropbox_esign);

      JSON.parse(dropboxESignAuthResponse!);

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
  };

  return <AuthorizationContext.Provider value={props}>{children}</AuthorizationContext.Provider>;
};
