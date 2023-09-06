import { APIChatHeaderKeyNames, DropboxESignRequest } from "api/chat/types";
import { NextApiRequest } from "next";
import { HttpError } from "@dropbox/sign";

import { ChatCompletionChoice, generate_dropbox_e_signature_request_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import supabase from "providers/supabase";
import dropbox from "providers/dropbox";
import { CreateEmbeddedSignatureRequestArgs } from "providers/dropbox/dropbox.types";

const generate_dropbox_e_signature_request = async (
  args: generate_dropbox_e_signature_request_args,
  choice: ChatCompletionChoice,
  _currentMessage: DropboxESignRequest["currentMessage"],
  request: NextApiRequest,
): Promise<ChatCompletionChoice> => {
  try {
    logger.info(`generate_dropbox_e_signature_request: ${args}`);

    const accessToken = request.headers[APIChatHeaderKeyNames.x_dropbox_access_token] as string;

    const embeddedSignatureRequestArgs: CreateEmbeddedSignatureRequestArgs = {
      title: args.title,
      subject: args.subject,
      message: args.message,
      signers: args.signers.split(",").map((signer) => {
        const [name, email] = signer.split("<");

        return {
          name: name.trim(),
          emailAddress: email.replace(">", "").trim(),
        };
      }),
    };

    const { signedUrl } = await supabase.createSignedURL("user", args.file_name, 60);

    const fileUrls = [signedUrl];

    const result = await dropbox.createEmbeddedSignatureRequest(accessToken, embeddedSignatureRequestArgs, fileUrls);

    return {
      finish_reason: "function_call",
      index: 0,
      message: {
        role: "assistant",
        content: `A signature request was created for ${args.file_name}.

        Review it at <a href="${result.body.signatureRequest?.detailsUrl}" target="_blank">${result.body.signatureRequest?.detailsUrl}</a>.`,
        type: "text",
        hasInnerHtml: true,
      },
    };
  } catch (error) {
    logger.error(error);

    if ((error as HttpError)?.body?.error?.errorName === "unauthorized") {
      return {
        ...choice,
        message: {
          ...choice.message,
          content: `You need to connect your Dropbox account first: <a href="https://app.hellosign.com/oauth/authorize?response_type=code&client_id=${
            process.env.DROPBOX_CLIENT_ID
          }&state=${Date.now()}&redirect_uri=${process.env.DROPBOX_REDIRECT_URI}">Click to authorize</a>.`,
          hasInnerHtml: true,
          type: "readonly",
        },
      };
    }

    if ((error as HttpError)?.body?.error?.errorMsg) {
      return {
        ...choice,
        message: {
          ...choice.message,
          content: (error as HttpError)?.body?.error?.errorMsg,
          type: "readonly",
        },
      };
    }

    throw error;
  }
};

export default generate_dropbox_e_signature_request;
