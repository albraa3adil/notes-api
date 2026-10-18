import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
    level: env.logLevel ?? "info",
    transport: env.isProduction
      ? undefined
      : {
          target: "pino-pretty",
          options: {
              colorize: true,
              translateTime: "SYS:standard",
              // ignore: "pid,hostname",
      },
    },
});