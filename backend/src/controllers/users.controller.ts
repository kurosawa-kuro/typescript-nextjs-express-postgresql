import { type Request, type Response, type NextFunction } from "express";
import { UsersServices } from "../services/users.service";
import { StatusCodes } from "http-status-codes";
import { User } from "../schemas/users.schema";

export async function get(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
console.log('get')

    const result = (await UsersServices.getData()).data;
    res.status(StatusCodes.OK).json(result);
    next();
  } catch (err) {
    next(err);
  }
}

export async function getOne(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id: string = req.params.id;
    const result = (await UsersServices.getOneData(id)).data;
    if (!result) {
      res.status(StatusCodes.NOT_FOUND).json({});
    } else {
      res.status(StatusCodes.OK).json(result);
    }
    next();
  } catch (err) {
    next(err);
  }
}

export async function createOne(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = (await UsersServices.createOne(req.body as User)).data;
    res.status(StatusCodes.CREATED).json(result);
    next();
  } catch (err) {
    next(err);
  }
}


export const UsersControllers = {
  get,
  getOne,
  createOne,
};
