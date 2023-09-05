import * as DropboxSign from "@dropbox/sign";

import logger from "providers/logger";

const createEmbeddedSignatureRequest = async (
  accessToken: string,
  args: Pick<DropboxSign.SignatureRequestCreateEmbeddedRequest, "title" | "subject" | "message">,
  fileUrls: DropboxSign.SignatureRequestCreateEmbeddedRequest["fileUrls"],
) => {
  try {
    logger.info(`createEmbeddedSignatureRequest`, { args });

    const signatureRequestApi = new DropboxSign.SignatureRequestApi();

    signatureRequestApi.accessToken = accessToken;

    const signingOptions: DropboxSign.SubSigningOptions = {
      draw: true,
      type: true,
      upload: true,
      phone: true,
      defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
    };

    const data: DropboxSign.SignatureRequestCreateEmbeddedRequest = {
      clientId: process.env.DROPBOX_CLIENT_ID!,
      title: args.title,
      subject: args.subject,
      message: args.message,
      fileUrls,
      signingOptions,
      testMode: true,
    };

    const result = await signatureRequestApi.signatureRequestCreateEmbedded(data);

    logger.info(result);

    return result;
  } catch (error) {
    logger.error(error);

    throw error;
  }
};

export default createEmbeddedSignatureRequest;
