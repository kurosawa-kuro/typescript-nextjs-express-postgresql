// src/app/services/users.service.ts

import { injectable, inject } from 'inversify';
import { User, PrismaClient } from '@prisma/client';
import { IUsersService } from '../types/interfaces';
import { TYPES } from '../types/types'; // Ensure the import path is correct

@injectable()
export class UsersService implements IUsersService {
  constructor(@inject(TYPES.PrismaClient) private db: PrismaClient) {}

  public async getData(): Promise<User[]> {
    return this.db.user.findMany();
  }

  public async getOneData(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  public async createOne(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    return this.db.user.create({
      data: user,
    });
  }
}
