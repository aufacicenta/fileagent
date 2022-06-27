import * as nearAPI from "near-api-js";

export default (amount: string) => nearAPI.utils.format.parseNearAmount(amount);
