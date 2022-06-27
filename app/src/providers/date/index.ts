import { MomentFormatSpecification, MomentInput } from "moment";

import timeFromNow from "./timeFromNow";
import client from "./client";
import getDefaultDateFormat, {
  toNanoseconds,
  now,
  fromNanoseconds,
  toUtcOffsetNanoseconds,
} from "./getDefaultDateFormat";

const parseFromFormat = (inp?: MomentInput, format?: MomentFormatSpecification, strict?: boolean) =>
  client(inp, format, strict);

export default {
  parseFromFormat,
  timeFromNow,
  getDefaultDateFormat,
  toNanoseconds,
  fromNanoseconds,
  now,
  client,
  toUtcOffsetNanoseconds,
};
