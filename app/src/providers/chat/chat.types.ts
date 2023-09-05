import * as DropboxSign from "@dropbox/sign";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources/chat";

import { ChatContextMessage } from "context/message/MessageContext.types";

export enum FunctionCallName {
  extract_content_from_pdf_file = "extract_content_from_pdf_file",
  generate_dropbox_e_signature_request = "generate_dropbox_e_signature_request",
}

export type ChatCompletionChoice = OpenAI.Chat.ChatCompletion.Choice & {
  message: ChatCompletionMessage & Pick<ChatContextMessage, "hasInnerHtml" | "type">;
};

export type extract_content_from_pdf_file_args = {
  file_name: string;
};

export type generate_dropbox_e_signature_request_args = {
  file_name: string;
  title: DropboxSign.SignatureRequestCreateEmbeddedRequest["title"];
  subject: DropboxSign.SignatureRequestCreateEmbeddedRequest["subject"];
  message: DropboxSign.SignatureRequestCreateEmbeddedRequest["message"];
};
