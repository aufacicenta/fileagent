import { SquareAPILabel } from "context/message/MessageContext.types";
import { ChatCompletionChoice } from "providers/chat/chat.types";

const scopes = ["MERCHANT_PROFILE_READ", "ORDERS_READ"].join("+");
const endpoint =
  process.env.NODE_ENV === "production"
    ? `https://connect.squareup.com/oauth2/authorize`
    : `https://connect.squareupsandbox.com/oauth2/authorize`;

const getSquareAuthChoice = (choice: ChatCompletionChoice): ChatCompletionChoice => ({
  ...choice,
  message: {
    ...choice.message,
    content: `You need to connect your Square account first: <a href="${endpoint}?client_id=${
      process.env.SQUARE_APP_ID
    }&scope=${scopes}&session=false&state=${Date.now()}">Click to authorize</a>.`,
    hasInnerHtml: true,
    type: "readonly",
    label: SquareAPILabel.square_request_auth_error,
  },
});

export default getSquareAuthChoice;
