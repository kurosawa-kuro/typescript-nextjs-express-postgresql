// backend/src/app/types/interfaces.ts

import { type Request, type Response, type NextFunction } from "express";
import { User } from "@prisma/client";

export interface IUsersService {
  getData(): Promise<User[]>;
  getOneData(id: string): Promise<User | null>;
  createOne(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User>;
}

export interface IUsersController {
  get(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  createOne(req: Request, res: Response, next: NextFunction): Promise<void>;
}
