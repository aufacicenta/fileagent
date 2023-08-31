/* eslint-disable no-param-reassign */
import React, { useCallback } from "react";

import { useObservable } from "hooks/useObservable/useObservable";
import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";
import { useMessageContext } from "context/message/useMessageContext";
import supabase from "providers/supabase";
import { MessageFileType } from "ui/dropzone/message-file-type/MessageFileType";
import { Button } from "ui/button/Button";
import { Typography } from "ui/typography/Typography";

import { FileContext } from "./FileContext";
import { FileContextControllerProps } from "./FileContext.types";

export const FileContextController = ({ children }: FileContextControllerProps) => {
  const observable = useObservable();

  const queuedFiles: DropzoneFileExtended[] = [];

  const messageContext = useMessageContext();

  const upload = useCallback(async (file: DropzoneFileExtended) => {
    try {
      await supabase.uploadFile("user", file);

      messageContext.updateMessage({
        role: "assistant",
        content: `File "${file.name}" uploaded successfully. What would you like to do with it?`,
        beforeContentComponent: (
          <Typography.Description>
            NOTE: This file is assigned to a temporary user.{" "}
            <Typography.Link href="#">Create an account</Typography.Link> to keep it.
          </Typography.Description>
        ),
        afterContentComponent: (
          <MessageFileType.Options>
            <Button color="secondary" variant="outlined" size="s">
              Download
            </Button>
            <Button color="secondary" variant="outlined" size="s">
              Extract content
            </Button>
            <Button color="secondary" variant="outlined" size="s">
              Send
            </Button>
            <Button color="secondary" variant="outlined" size="s">
              Get file details
            </Button>
            <Button color="danger" variant="outlined" size="s">
              Delete
            </Button>
          </MessageFileType.Options>
        ),
        type: "file",
        file,
        id: file.upload!.uuid,
      });
    } catch (error) {
      console.error(error);

      if ((error as Error).message === "ERR_FILE_EXISTS") {
        messageContext.updateMessage({
          role: "assistant",
          content: `File "${file.name}" already exists.`,
          type: "file",
          file,
          id: file.upload!.uuid,
        });
      }

      if ((error as Error).message === "ERR_NETWORK_ERROR") {
        messageContext.updateMessage({
          role: "assistant",
          content: `File "${file.name}" failed to upload. Is your wi-fi on?`,
          type: "file",
          file,
          id: file.upload!.uuid,
        });
      }
    }
  }, []);

  const queue = useCallback(() => {
    if (queuedFiles.length === 0) {
      return;
    }

    const file = queuedFiles.shift();

    upload(file!);
  }, []);

  const extendFileObjects = ($files: Array<DropzoneFileExtended>) => {
    const extendFile = (file: DropzoneFileExtended) => {
      file.progressObservable = observable.create(file.upload!.uuid, 0);
      file.setProgress = observable.set;

      queuedFiles.push(file);

      messageContext.appendMessage({
        role: "assistant",
        content: `File "${file.name}" added to the queue.`,
        type: "file",
        file,
        id: file.upload!.uuid,
      });
    };

    try {
      if (typeof $files === "object" && !Array.isArray($files)) {
        for (let i = 0; i < ($files as FileList).length; i += 1) {
          const file = ($files as FileList).item(i);
          extendFile(file as DropzoneFileExtended);
        }
      } else {
        $files.forEach((file) => extendFile(file));
      }
    } catch (error) {
      console.log(error);
    }

    return $files;
  };

  const props = {
    extendFileObjects,
    upload,
    queue,
  };

  return <FileContext.Provider value={props}>{children}</FileContext.Provider>;
};
