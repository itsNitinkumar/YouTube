import winston from "winston"
import { config } from "../config/env"

const { combine, timestamp, printf, colorize, errors } = winston.format

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

export const logger = winston.createLogger({
  level: config.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    config.NODE_ENV === "development" ? combine(colorize(), logFormat) : logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: config.NODE_ENV === "development" ? combine(colorize(), logFormat) : logFormat
    }),
  ],
})
