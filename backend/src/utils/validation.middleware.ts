import { NextFunction, Request, RequestHandler, Response } from "express";
import { AnyZodObject } from "zod";
import { StatusCodes } from "http-status-codes";

export default function validationMiddleware(
  schema: AnyZodObject,
): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = schema.safeParse({ params: req.params, body: req.body });
    if (result.success === false) {
      const errorFormatted = result.error.format();
      res.status(StatusCodes.BAD_REQUEST).json(errorFormatted);
    } else {
      next();
    }
  };
}
