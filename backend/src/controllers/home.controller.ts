import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function get(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(StatusCodes.OK).json("This is the home Page");
    next();
  } catch (err) {
    next(err);
  }
}

export const HomeController = {
  get,
};
