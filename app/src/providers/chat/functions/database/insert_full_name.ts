import { FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";

import { FunctionCallToolActionOutput, get_full_name_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import supabase from "providers/supabase";

const insert_full_name = async (
  args: get_full_name_args,
  agentRequest: FileAgentRequest,
  _request: NextApiRequest,
): Promise<FunctionCallToolActionOutput> => {
  try {
    const { name, lastname } = args;

    // keep track of a potential user setting different names from same number
    const { error } = await supabase.client.from("user_info").insert({
      name,
      lastname,
      messagebird_participant_id: agentRequest.currentMessageMetadata?.messagebird?.participantId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
    };
  } catch (error) {
    logger.error(error);

    return {
      success: false,
    };
  }
};

export default insert_full_name;
