import axios from "axios";

import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";

async function uploadFile(bucketName: string, file: DropzoneFileExtended) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucketName}/${file.name}`;

  const form = new FormData();
  form.append("", file);

  try {
    const result = await axios.request({
      method: "POST",
      url,
      data: form,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      onUploadProgress: (p) => {
        file.setProgress(file.upload!.uuid, Number((p.progress! * 100).toFixed(2)));
      },
    });

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

export default uploadFile;
