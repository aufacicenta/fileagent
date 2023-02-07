import fetchFeedResult from "./fetchFeedResult";
import { Job } from "./types";

const fetchCurrentPrice = async (jobs: Array<Job>) => {
  try {
    const data = await fetchFeedResult(jobs);

    if (!data?.result || Number.isNaN(data.result)) {
      return 0;
    }

    return Number(data?.result);
  } catch (error) {
    console.log(error);
  }

  return 0;
};

export default fetchCurrentPrice;
