// src/app/controllers/users.controller.ts

import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../types/types";
import { IUsersService, IUsersController } from "../types/interfaces";
import { AppError } from "../utils/errorMiddleware";

@injectable()
export class UsersController implements IUsersController {
  constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.usersService.getData();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const result = await this.usersService.getOneData(id);
      if (!result) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err instanceof AppError ? err : new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  public async createOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.usersService.createOne(req.body);
      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
      } else {
        next(new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }
}