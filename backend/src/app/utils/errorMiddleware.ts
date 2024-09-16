// backend\src\app\utils\errorMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

interface CustomError extends Error {
  statusCode?: number;
}

export default function errorMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Entering errorMiddleware");

  // エラーオブジェクトのログ
  console.log("Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode
  });

  // リクエスト情報のログ
  console.log("Request info:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

  // ステータスコードの決定
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // エラーレスポンスの作成
  const errorResponse = {
    error: {
      message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
      status: statusCode,
      timestamp: new Date().toISOString(),
    }
  };

  // 開発環境の場合、スタックトレースを含める
  // if (process.env.NODE_ENV !== 'production') {
  //   errorResponse.error['stack'] = err.stack;
  // }

  // レスポンスの送信
  res.status(statusCode).json(errorResponse);

  // エラーログの記録
  logger.error(`[${statusCode}] ${err.message} - ${req.method} ${req.url}`);

  console.log("Exiting errorMiddleware");
}

// カスタムエラークラスの定義（必要に応じて別ファイルに移動可能）
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}