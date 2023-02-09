import pulse from "providers/pulse";

import { Job, SwitchboardFeedResponse } from "./types";

const fetchFeedResult = async (jobs: Array<Job>) => {
  try {
    const base = "https://api.switchboard.xyz/api";
    const url = pulse.isMainnet() ? `${base}/mainnet` : `${base}/test`;
    const cluster = pulse.isMainnet() ? `mainnet` : `devnet`;

    const body = {
      cluster,
      jobs,
    };

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });

    const data: SwitchboardFeedResponse = await response.json();

    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }

  return {
    result: 0,
  };
};

export default fetchFeedResult;
