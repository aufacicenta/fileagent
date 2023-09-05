import { DropboxESignRequest } from "api/chat/types";
import * as DropboxSign from "@dropbox/sign";
import { NextApiRequest } from "next";

import { ChatCompletionChoice, generate_dropbox_e_signature_request_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import supabase from "providers/supabase";
import dropbox from "providers/dropbox";

const generate_dropbox_e_signature_request = async (
  args: generate_dropbox_e_signature_request_args,
  choice: ChatCompletionChoice,
  _currentMessage: DropboxESignRequest["currentMessage"],
  request: NextApiRequest,
): Promise<ChatCompletionChoice> => {
  try {
    logger.info(`generate_dropbox_e_signature_request: ${args}`);

    const accessToken = request.headers["x-dropbox-access-token"] as string;

    const embeddedSignatureRequestArgs: Pick<
      DropboxSign.SignatureRequestCreateEmbeddedRequest,
      "title" | "subject" | "message"
    > = {
      title: args.title,
      subject: args.subject,
      message: args.message,
    };

    const { signedUrl } = await supabase.createSignedURL("user", args.file_name, 60);

    const fileUrls = [signedUrl];

    const result = await dropbox.createEmbeddedSignatureRequest(accessToken, embeddedSignatureRequestArgs, fileUrls);

    return {
      finish_reason: "function_call",
      index: 0,
      message: {
        role: "assistant",
        content: `A signature request was created.

        Review it at <a href="${result.body.signatureRequest?.detailsUrl}" target="_blank">${result.body.signatureRequest?.detailsUrl}</a>.`,
      },
    };
  } catch (error) {
    logger.error(error);

    return {
      ...choice,
      message: {
        ...choice.message,
        content: `You need to connect your Dropbox account first: <a href="https://app.hellosign.com/oauth/authorize?response_type=code&client_id=6b7001dcc9628cbaab796f85d698e5f6&state=416c212f" target="_blank">Click to authorize</a>.`,
        hasInnerHtml: true,
      },
    };
  }
};

export default generate_dropbox_e_signature_request;
