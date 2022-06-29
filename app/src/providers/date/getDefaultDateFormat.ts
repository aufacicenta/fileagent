import moment from "./client";

export const now = () => moment();

export const toUtcOffsetNanoseconds = (date?: number | string) =>
  moment(date).utcOffset(0).toDate().getTime() * 1000000;

export const toNanoseconds = (date: number) => date * 1000000;
export const fromNanoseconds = (date: number) => date / 1000000;

export const fromTimestampWithOffset = (timestamp: number) =>
  moment(fromNanoseconds(timestamp)).format("dddd, MMM DD YYYY hh:mm:ss A [GMT]Z");

export default (date?: Date | string | number) => moment(date || undefined).format("MMM DD, YYYY");
