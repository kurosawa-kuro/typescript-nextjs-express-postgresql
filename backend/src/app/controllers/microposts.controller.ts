// src/app/controllers/microposts.controller.ts

import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../types/types";
import { IMicropostsService, IMicropostsController } from "../types/interfaces";
import { AppError } from "../utils/errorMiddleware";

@injectable()
export class MicropostsController implements IMicropostsController {
  constructor(@inject(TYPES.MicropostsService) private micropostsService: IMicropostsService) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.micropostsService.getData();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const result = await this.micropostsService.getOneData(id);
      if (!result) {
        throw new AppError("Micropost not found", StatusCodes.NOT_FOUND);
      }
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err instanceof AppError ? err : new AppError((err as Error).message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }

  public async createOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.micropostsService.createOne(req.body);
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