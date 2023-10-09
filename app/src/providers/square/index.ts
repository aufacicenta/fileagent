import { Client, Environment } from "square";

import getSquareAuthChoice from "./get-square-auth-choice";

const getClient = (accessToken: string = process.env.SQUARE_ACCESS_TOKEN as string) =>
  new Client({
    accessToken,
    environment: Environment.Production,
  });

export default { getClient, getSquareAuthChoice };
