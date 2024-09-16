// backend/src/app/controllers/users.controller.ts

import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "@/app/types/types";
import { IUsersService, IUsersController } from "@/app/types/interfaces";
import { User } from "@/app/schemas/users.schema";
import { AppError } from "@/app/utils/errorMiddleware";

@injectable()
export class UsersController implements IUsersController {
  constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("Entering UsersController.get");
    try {
      const result = await this.usersService.getData();
      res.status(StatusCodes.OK).json(result);
      console.log("Exiting UsersController.get successfully");
    } catch (err) {
      console.log("Error caught in UsersController.get:", err);
      next(new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("Entering UsersController.getOne");
    try {
      const id: string = req.params.id;
      const result = await this.usersService.getOneData(id);
      if (!result) {
        console.log("User not found, throwing AppError");
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.OK).json(result);
      console.log("Exiting UsersController.getOne successfully");
    } catch (err) {
      console.log("Error caught in UsersController.getOne:", err);
      next(err instanceof AppError ? err : new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  public async createOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("Entering UsersController.createOne");
    try {
      const result = await this.usersService.createOne(req.body as User);
      res.status(StatusCodes.CREATED).json(result);
      console.log("Exiting UsersController.createOne successfully");
    } catch (err) {
      console.log("Error caught in UsersController.createOne:", err);
      next(new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
}