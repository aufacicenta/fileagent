import { create } from "ipfs-http-client";

export default create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    // @TODO make if safer: Base64 of infura projectId and projectSecret
    authorization: "Basic MkdLSEdlUjU1SDdyc2Y0UURVRDVwSXc2d0JSOjRjYzJmMmNjZWJiMzM1YzQ3MWIxMzg3OWUzMGQ5NTQ3",
  },
});
