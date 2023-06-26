// Use pixelmatch to compare the source image with the generated image from each Prompt
// https://github.com/htmlcsstoimage/image-compare-api/blob/master/api/index.js

// Loop through all player_ids of the market, fetch the prompt of each outcome and compare it with the source image
// Call the reveal method of the market contract with the account_id of the player and the percentage_diff
// The comparison closest to 0 wins

// Error if there's no prompt associated to the account
// Error if it's still no time to reveal the prompt

import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function Fn(request: NextRequest) {
  try {
    return NextResponse.json({
      name: `Hello, from ${request.url} I'm an Edge Function!`,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Error from ${request.url}: ${(error as Error).message}`,
    });
  }
}
