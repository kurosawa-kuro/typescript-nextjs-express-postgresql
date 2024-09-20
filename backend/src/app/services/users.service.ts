// backend/src/app/services/users.service.ts

import { injectable } from "inversify";
import { User } from "@prisma/client";
import { IUsersService } from "@/app/types/interfaces";
import { db } from "../../../prisma/prismaClient";

@injectable()
export class UsersService implements IUsersService {
  public async getData(): Promise<User[]> {
    return db.user.findMany();
  }

  public async getOneData(id: string): Promise<User | null> {
    return db.user.findUnique({
      where: { id: parseInt(id) },
    });
  }

  public async createOne(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    return db.user.create({
      data: user,
    });
  }
}