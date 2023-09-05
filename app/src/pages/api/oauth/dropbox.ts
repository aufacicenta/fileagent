import { NextApiRequest, NextApiResponse } from "next";
import * as DropboxSign from "@dropbox/sign";

import logger from "providers/logger";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`processing dropbox authorization callback`);

    logger.info({ query: request.query });

    const query = request.query as { state: string; code: string };

    const data = new DropboxSign.OAuthTokenGenerateRequest();

    data.state = query.state;
    data.code = query.code;
    data.clientId = process.env.DROPBOX_CLIENT_ID as string;
    data.clientSecret = process.env.DROPBOX_CLIENT_SECRET as string;
    data.grantType = "authorization_code";

    const oAuthApi = new DropboxSign.OAuthApi();

    const result = await oAuthApi.oauthTokenGenerate(data);

    logger.info(result);

    response.setHeader("Set-Cookie", [`dropbox_esign=${JSON.stringify(result)}; Path=/; HttpOnly; Secure`]);

    // response.redirect(301, `/`);

    response.status(200).json(result);
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
    });
  }
}
