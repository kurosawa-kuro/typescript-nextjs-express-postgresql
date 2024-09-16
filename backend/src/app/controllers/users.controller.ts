// backend\src\app\controllers\users.controller.ts

import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "@/app/types/types";
import { IUsersService, IUsersController } from "@/app/types/interfaces";
import { User } from "@/app/schemas/users.schema";

@injectable()
export class UsersController implements IUsersController {
  constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.usersService.getData();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err); // エラーをnext()に渡す
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const result = await this.usersService.getOneData(id);
      if (!result) {
        res.status(StatusCodes.NOT_FOUND).json({});
      } else {
        res.status(StatusCodes.OK).json(result);
      }
    } catch (err) {
      next(err); // エラーをnext()に渡す
    }
  }

  public async createOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.usersService.createOne(req.body as User);
      res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      next(err); // エラーをnext()に渡す
    }
  }
}