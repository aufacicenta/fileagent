import { FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";
import { RequiredActionFunctionToolCall, Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";

import openai from "providers/openai";

import { get_full_name_args, FunctionCallToolActionOutput, FunctionToolCallName } from "./chat.types";
import insert_full_name from "./functions/database/insert_full_name";

const functions: Record<
  FunctionToolCallName,
  (
    args: get_full_name_args,
    agentRequest: FileAgentRequest,
    request: NextApiRequest,
  ) => Promise<FunctionCallToolActionOutput>
> = {
  [FunctionToolCallName.get_full_name]: (
    args: get_full_name_args,
    agentRequest: FileAgentRequest,
    request: NextApiRequest,
  ) => insert_full_name(args, agentRequest, request),
};

const processFunctionToolCalls = (
  actions: RequiredActionFunctionToolCall[],
  agentRequest: FileAgentRequest,
  request: NextApiRequest,
  thread: Thread,
  run: Run,
) => {
  actions.forEach(async (action) => {
    const { arguments: args, name } = action.function;

    const output = await functions[name as FunctionToolCallName](
      typeof args === "object" ? args : (JSON.parse(args) as any),
      agentRequest,
      request,
    );

    await openai.client.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
      tool_outputs: [
        {
          tool_call_id: action.id,
          output: JSON.stringify(output),
        },
      ],
    });
  });
};

export default processFunctionToolCalls;
