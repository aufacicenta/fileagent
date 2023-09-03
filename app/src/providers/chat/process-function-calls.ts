import OpenAI from "openai";
import { DropboxESignRequest } from "api/chat/types";

import { FunctionCallName, extract_content_from_pdf_file_args } from "./chat.types";
import extract_content_from_pdf_file from "./functions/extract_content_from_pdf_file";

const processFunctionCalls = (choices: OpenAI.Chat.Completions.ChatCompletion["choices"]) => {
  const functionCalls = choices.filter((choice) => !!choice.message.function_call);

  console.log({ functionCalls });

  const promises: Array<
    (currentMessage: DropboxESignRequest["currentMessage"]) => Promise<OpenAI.Chat.ChatCompletion.Choice>
  > = [];

  if (functionCalls.length === 0) return { choices, promises };

  const functions = {
    [FunctionCallName.extract_content_from_pdf_file]:
      (args: extract_content_from_pdf_file_args, choice: OpenAI.Chat.ChatCompletion.Choice) =>
      (currentMessage: DropboxESignRequest["currentMessage"]) =>
        extract_content_from_pdf_file(args, choice, currentMessage),
  };

  functionCalls.forEach((choice) => {
    const { arguments: args, name } = choice.message.function_call!;

    promises.push(functions[name as FunctionCallName](JSON.parse(args) as extract_content_from_pdf_file_args, choice));
  });

  console.log({ promises });

  return { choices, promises };
};

export default processFunctionCalls;
