import client from "./client";

const createSignedURL = async (bucket: string, path: string, expiresIn: number = 60) => {
  try {
    console.log(`Creating signed URL for ${bucket}/${path} with expiration of ${expiresIn} seconds`);

    const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expiresIn);

    if (error) {
      throw error;
    }

    console.log({ data });

    return data;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export default createSignedURL;
