import { FunctionCallName } from "providers/chat/chat.types";
import { Example } from "providers/googleai/googleai.types";

export const examples: Example[] = [
  {
    input: { content: "List all my Square locations" },
    output: {
      content: `{"function_call": { "name": "${FunctionCallName.get_square_locations}", "arguments": {} }`,
    },
  },
  {
    input: { content: "Get all my square orders of this month" },
    output: {
      content: `{"function_call": { "name": "${FunctionCallName.search_square_orders}", "arguments": { "date_time_filter": { "created_at": { "start_at": "YYYYMMDD" } } } } }`,
    },
  },
  {
    input: { content: "Get all my square payments of this year" },
    output: {
      content: `{"function_call": { "name": "${FunctionCallName.get_square_payments}", "arguments": { "begin_time": "YYYYMMDD", "end_time": "YYYYMMDD" } } }`,
    },
  },
  {
    input: { content: "What's the total amount of my last square payments of this month" },
    output: {
      content: `{"function_call": { "name": "${FunctionCallName.get_square_payments}", "arguments": { "begin_time": "YYYYMMDD", "end_time": "YYYYMMDD" } } }`,
    },
  },
];
