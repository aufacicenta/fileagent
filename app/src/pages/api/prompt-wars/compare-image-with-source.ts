// Use pixelmatch to compare the source image with the generated image from each Prompt
// https://github.com/htmlcsstoimage/image-compare-api/blob/master/api/index.js

// Loop through all player_ids of the market, fetch the prompt of each outcome and compare it with the source image
// Call the reveal method of the market contract with the account_id of the player and the percentage_diff
// The comparison closest to 0 wins

// Error if there's no prompt associated to the account
// Error if it's still no time to reveal the prompt

import { NextApiRequest, NextApiResponse } from "next";

// @TODO compare the prompt result image with the source image
// labels: 500 USDT
export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    // @TODO authenticate the request, only this server should be able to execute this endpoint
    // labels: 100 USDT
    response.status(200).json({ result: 0 });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: (error as Error).message });
  }
}
