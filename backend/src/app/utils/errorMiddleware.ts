// backend/src/app/utils/errorMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default function errorMiddleware(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Entering errorMiddleware");
  console.log("Error:", err);

  const statusCode = (err as AppError).statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  console.log(`Setting response status to ${statusCode}`);

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    }
  });

  console.log("Response body:", {
    error: {
      message,
      status: statusCode,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    }
  });

  logger.error(`[${statusCode}] ${message} - ${req.method} ${req.url}`);
  console.log("Exiting errorMiddleware");
}