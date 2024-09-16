// backend/src/app/types/interfaces.ts

import { type Request, type Response, type NextFunction } from "express";
import { User } from "@/app/schemas/users.schema";

export interface IUsersService {
  getData(): Promise<User[]>;
  getOneData(id: string): Promise<User | null>;
  createOne(user: User): Promise<User>;
}

export interface IUsersController {
  get(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  createOne(req: Request, res: Response, next: NextFunction): Promise<void>;
}