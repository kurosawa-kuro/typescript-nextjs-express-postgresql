// src/app/services/microposts.service.ts

import { injectable, inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { IMicropostsService } from '../types/interfaces';
import { TYPES } from '../types/types';
import { PrismaClient, Prisma, Micropost } from '@prisma/client';
import { AppError } from '../utils/errorMiddleware';

@injectable()
export class MicropostsService implements IMicropostsService {
  constructor(@inject(TYPES.PrismaClient) private db: PrismaClient) {}

  async getData() {
    try {
      return await this.db.micropost.findMany();
    } catch (error) {
      console.error('Error in getData:', error);
      throw new AppError('Failed to get microposts', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getOneData(id: string) {
    try {
      const micropost = await this.db.micropost.findUnique({
        where: { id: Number(id) },
      });
      if (!micropost) {
        throw new AppError('Micropost not found', StatusCodes.NOT_FOUND);
      }
      return micropost;
    } catch (error) {
      console.error('Error in getOneData:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get micropost', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createOne(micropost: Omit<Micropost, 'id' | 'created_at' | 'updated_at'>): Promise<Micropost> {
    try {
      const userId = Number(micropost.user_id);
      if (isNaN(userId)) {
        throw new AppError('Invalid user_id', StatusCodes.BAD_REQUEST);
      }

      const user = await this.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', StatusCodes.BAD_REQUEST);
      }

      console.log('Creating micropost:', { ...micropost, user_id: userId });
      const createdMicropost = await this.db.micropost.create({
        data: { ...micropost, user_id: userId },
      });
      console.log('Created micropost:', createdMicropost);
      return createdMicropost;
    } catch (error) {
      console.error('Error creating micropost:', error);
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AppError(error.message, StatusCodes.BAD_REQUEST);
      }
      throw new AppError('Failed to create micropost', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
