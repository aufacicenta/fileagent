import { ReactNode } from "react";

import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";

export type FileContextControllerProps = {
  children: ReactNode;
};

export type FileContextType = {
  extendFileObjects: (files: Array<DropzoneFileExtended>) => Array<DropzoneFileExtended>;
  upload: (file: DropzoneFileExtended) => void;
  queue: () => void;
  getStorageBucketName: () => string;
};
