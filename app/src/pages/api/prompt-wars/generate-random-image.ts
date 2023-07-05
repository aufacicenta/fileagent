// https://replicate.com/stability-ai/stable-diffusion - to render prompts, we'll use this API, it only renders 512x512 or 768x768 images
// https://source.unsplash.com/random/512x512?sport - this is unsplash random photo generator, we can also feed the Stable Diffusion API with random prompts created by ChatGPT

// Once an image is created, store its IPFS hash in a database with an is_used flag set to false, set to true when we've used this image
// Or don't store anything, just chain the API calls, create a market just after this endpoint

import { NextApiRequest, NextApiResponse } from "next";

// @TODO fetch images from generators, upload them to IPFS and create a market
// labels: 500 USDT
export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    // @TODO authenticate the request, only this server should be able to execute this endpoint
    // labels: 100 USDT

    response.status(200).json({ image_uri: "TODO" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: (error as Error).message });
  }
}
