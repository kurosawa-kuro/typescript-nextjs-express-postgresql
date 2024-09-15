import { type Request, type Response, type NextFunction } from "express";
import { UsersServices } from "../services/users.service.js";
import { StatusCodes } from "http-status-codes";
import { User } from "../schemas/users.schema.js";

export async function get(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
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

export async function updateOne(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id: string = req.params.id;
    const result = (await UsersServices.updateOne(id, req.body as User)).data;
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

export async function deleteOne(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id: string = req.params.id;
    const result = (await UsersServices.deleteOne(id)).data;
    if (!result) {
      res.status(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.NO_CONTENT).json();
    }
    next();
  } catch (err) {
    next(err);
  }
}

export const UsersControllers = {
  get,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};
