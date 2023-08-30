/* eslint-disable no-param-reassign */
import React, { useState } from "react";

import { useObservable } from "hooks/useObservable/useObservable";
import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";

import { FileContext } from "./FileContext";
import { FileContextControllerProps } from "./FileContext.types";

export const FileContextController = ({ children }: FileContextControllerProps) => {
  const [files, setFiles] = useState<DropzoneFileExtended[]>([]);
  const observable = useObservable();

  const extendFileObjects = ($files: Array<DropzoneFileExtended>) => {
    console.log($files);

    $files.forEach((file) => {
      file.progressObservable = observable.create(file.upload!.uuid, 0);
      file.setProgress = observable.set;
    });

    setFiles((prev) => [...prev, ...$files]);

    return files;
  };

  const props = {
    extendFileObjects,
  };

  return <FileContext.Provider value={props}>{children}</FileContext.Provider>;
};
