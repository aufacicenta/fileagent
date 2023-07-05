import client from "./client";
import upload, { getFileAsIPFSUrl } from "./upload";
import asHttpsURL from "./asHttpsURL";
import fetch from "./fetch";

export default {
  client,
  fetch,
  upload,
  asHttpsURL,
  getFileAsIPFSUrl,
};
