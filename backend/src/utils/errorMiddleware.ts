import { Request, Response, NextFunction } from "express";
import { logger } from "./logger.js";

export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const defaultMessage = "Something failed!";
  res.status(500).send({ error: defaultMessage });
  const message = `Method: ${req.method} path: ${
    req.url.split("?")[0]
  } Status: ${res.statusCode} error: ${err.message}`;
  logger.error(message);
  next();
}
