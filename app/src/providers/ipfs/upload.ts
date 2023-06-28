import path from "path";
import { HTTPClientExtraOptions } from "ipfs-http-client/dist/src/types";
import { CID } from "multiformats/cid";

import client from "./client";
import { ContentOptions, IpfsResponse } from "./ipfs.types";

function ensureIpfsUriPrefix(cidOrURI: CID) {
  let uri = cidOrURI.toString();

  if (!uri.startsWith("ipfs://")) {
    uri = `ipfs://${cidOrURI}`;
  }

  // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
  if (uri.startsWith("ipfs://ipfs/")) {
    uri = uri.replace("ipfs://ipfs/", "ipfs://");
  }

  return uri;
}

const getFileBasename = (options: ContentOptions) => {
  const filePath = options.path || "asset.bin";
  const basename = path.basename(filePath);

  return basename;
};

async function addFileToIPFS(
  content: Uint8Array,
  options: ContentOptions,
  ipfsOptions?: HTTPClientExtraOptions,
): Promise<IpfsResponse> {
  const basename = getFileBasename(options);

  const ipfsPath = `/pulsemarkets/${basename}`;

  const result = await client.add({ path: ipfsPath, content }, { hashAlg: "sha2-256", ...ipfsOptions });

  return {
    ...result,
    path: `${result.cid.toString()}/${basename}`,
    uri: `${ensureIpfsUriPrefix(result.cid)}/${basename}`,
  };
}

const upload = async (content: Buffer, name: string): Promise<IpfsResponse | null> => {
  try {
    const result = await addFileToIPFS(content, { path: name });

    return {
      ...result,
      name,
    };
  } catch (error) {
    console.log(error);

    throw new Error("providers/ipfs/upload: failed to upload file");
  }
};

export const getFileAsIPFSUrl = async (url: string, headers?: HeadersInit): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const blob = await response.arrayBuffer();
    const fileName = url.split("/").pop();

    const ipfsResponse = await upload(Buffer.from(blob), fileName!);

    return ipfsResponse?.path || "";
  } catch (error) {
    console.log(error);

    throw new Error("providers/ipfs/getfileAsIPFsUrl: invalid file response");
  }
};

export default upload;
