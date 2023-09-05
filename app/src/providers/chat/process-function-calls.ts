import OpenAI from "openai";
import { DropboxESignRequest } from "api/chat/types";
import { NextApiRequest } from "next";

import {
  ChatCompletionChoice,
  FunctionCallName,
  extract_content_from_pdf_file_args,
  generate_dropbox_e_signature_request_args,
} from "./chat.types";
import extract_content_from_pdf_file from "./functions/extract_content_from_pdf_file";
import generate_dropbox_e_signature_request from "./functions/generate_dropbox_e_signature_request";

const processFunctionCalls = (choices: OpenAI.Chat.Completions.ChatCompletion["choices"]) => {
  const functionCalls = choices.filter((choice) => !!choice.message.function_call);

  const promises: Array<
    (currentMessage: DropboxESignRequest["currentMessage"], request: NextApiRequest) => Promise<ChatCompletionChoice>
  > = [];

  if (functionCalls.length === 0) return { choices, promises };

  const functions = {
    [FunctionCallName.extract_content_from_pdf_file]:
      (args: extract_content_from_pdf_file_args, choice: ChatCompletionChoice) =>
      (currentMessage: DropboxESignRequest["currentMessage"]) =>
        extract_content_from_pdf_file(args, choice, currentMessage),
    [FunctionCallName.generate_dropbox_e_signature_request]:
      (args: generate_dropbox_e_signature_request_args, choice: ChatCompletionChoice) =>
      (currentMessage: DropboxESignRequest["currentMessage"], request: NextApiRequest) =>
        generate_dropbox_e_signature_request(args, choice, currentMessage, request),
  };

  functionCalls.forEach((choice) => {
    const { arguments: args, name } = choice.message.function_call!;

    promises.push(
      functions[name as FunctionCallName](JSON.parse(args) as any, {
        ...choice,
        message: { ...choice.message, type: "text" },
      }),
    );
  });

  return { choices, promises };
};

export default processFunctionCalls;
