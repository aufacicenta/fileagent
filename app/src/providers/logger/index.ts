import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, splat, colorize } = format;

const myFormat = printf((info) => {
  let { message } = info;

  if (typeof info.message === "object") {
    message = JSON.stringify(info.message, null, 2);
  }

  return `${info.timestamp} [${__filename}] ${info.level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat, splat(), colorize()),
  transports: [new transports.Console()],
});

export default logger;
