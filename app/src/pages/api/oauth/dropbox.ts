import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { OAuthTokenResponse } from "@dropbox/sign";

import logger from "providers/logger";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`processing dropbox authorization callback`);

    const query = request.query as { state: string; code: string };

    const data = {
      state: query.state,
      code: query.code,
      client_id: process.env.DROPBOX_CLIENT_ID as string,
      client_secret: process.env.DROPBOX_CLIENT_SECRET as string,
      grant_type: "authorization_code",
      test_mode: true,
    };

    const result = await axios.request<OAuthTokenResponse>({
      method: "POST",
      url: "https://app.hellosign.com/oauth/token",
      data,
    });

    logger.info(`setting cookie dropbox_esign and redirecting`);

    response.setHeader("Set-Cookie", [`dropbox_esign=${JSON.stringify(result.data)}; Path=/; HttpOnly; Secure`]);

    response.redirect(301, `/`);
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
    });
  }
}
