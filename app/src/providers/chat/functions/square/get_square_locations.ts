import { FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";

import { ChatCompletionChoice, get_square_locations_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import { SquareAPILabel } from "context/message/MessageContext.types";

const get_square_locations = async (
  _args: get_square_locations_args,
  _choice: ChatCompletionChoice,
  _currentMessage: FileAgentRequest["currentMessage"],
  _request: NextApiRequest,
): Promise<ChatCompletionChoice> => {
  try {
    logger.info(`get_square_locations: ${_args}`);

    return {
      finish_reason: "function_call",
      index: 0,
      message: {
        role: "assistant",
        content: `Here are your all your Square locations`,
        type: "text",
        hasInnerHtml: true,
        label: SquareAPILabel.square_get_locations_request_success,
      },
    };
  } catch (error) {
    logger.error(error);

    throw error;
  }
};

export default get_square_locations;
