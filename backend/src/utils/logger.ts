import winston from "winston";
import { Request, Response, NextFunction } from "express";

const logFormat = winston.format.printf(
  ({ timestamp, level, message, service }) =>
    `${level} ${service} ${timestamp}: ${message}`,
);
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.colorize(),
    winston.format.json(),
    logFormat,
  ),
  defaultMeta: { service: "some service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console());
}

export default function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const message = `Method: ${req.method} path: ${
    req.url.split("?")[0]
  } Status: ${res.statusCode}`;
  logger.info(message);

  next();
}
