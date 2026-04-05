import winston from "winston";
import { logFormat } from "./formats";
import { transports } from "./transports";

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports
});