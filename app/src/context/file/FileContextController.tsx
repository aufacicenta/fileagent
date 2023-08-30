/* eslint-disable no-param-reassign */
import React, { useCallback, useState } from "react";

import { useObservable } from "hooks/useObservable/useObservable";
import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";
import { useMessageContext } from "context/message/useMessageContext";

import { FileContext } from "./FileContext";
import { FileContextControllerProps } from "./FileContext.types";

export const FileContextController = ({ children }: FileContextControllerProps) => {
  const [_files, setFiles] = useState<DropzoneFileExtended[]>([]);
  const observable = useObservable();

  let queuedFiles: DropzoneFileExtended[] = [];

  const messageContext = useMessageContext();

  const upload = useCallback(async (file: DropzoneFileExtended) => {
    try {
      let progress = 0;

      const interval = setInterval(() => {
        progress += 10;

        file.setProgress(file.upload!.uuid, progress);

        if (progress === 100) {
          messageContext.updateMessage({
            role: "assistant",
            content: `File "${file.name}" uploaded successfully. What would you like to do with it?`,
            type: "file",
            file,
            id: file.upload!.uuid,
          });

          clearInterval(interval);

          queue(queuedFiles);

          return;
        }

        console.log({ progress, file: file.name });
      }, 1000);

      // const result = await minty.addFileToIPFS<IPFSFile>(
      //   file,
      //   { path: file.name },
      //   {
      //     progress: (bytes: number) => {
      //       file.setProgress(file.upload.uuid, (bytes / file.upload.total) * 100);
      //     },
      //   },
      // );

      // if (result.path) {
      //   file.setProgress(file.upload.uuid, 100);
      //   file.setIpfsResult(`${file.upload.uuid}-ipfs-result`, result);
      // }

      // result.name = file.name;

      // const files = ls.get<IPFSFile[]>("files", "[]");
      // files.push(result);
      // ls.set("files", files);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const queue = useCallback(($files: DropzoneFileExtended[]) => {
    console.log({ $files, queuedFiles });

    if (queuedFiles.length === 0) {
      queuedFiles = $files;
    }

    if (queuedFiles.length === 0) {
      return;
    }

    const file = queuedFiles.shift();

    upload(file!);
  }, []);

  const extendFileObjects = ($files: Array<DropzoneFileExtended>) => {
    $files.forEach((file) => {
      file.progressObservable = observable.create(file.upload!.uuid, 0);
      file.setProgress = observable.set;

      messageContext.appendMessage({
        role: "assistant",
        content: `File "${file.name}" added to the queue.`,
        type: "file",
        file,
        id: file.upload!.uuid,
      });
    });

    setFiles((prev) => [...prev, ...$files]);

    return $files;
  };

  const props = {
    extendFileObjects,
    upload,
    queue,
  };

  return <FileContext.Provider value={props}>{children}</FileContext.Provider>;
};
