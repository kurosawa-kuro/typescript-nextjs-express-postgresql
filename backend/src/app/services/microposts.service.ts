// src/app/services/microposts.service.ts

import { injectable } from "inversify";
import { Micropost, Prisma } from "@prisma/client";
import { IMicropostsService } from "@/app/types/interfaces";
import { db } from "../../../prisma/prismaClient";
import { AppError } from "@/app/utils/errorMiddleware";
import { StatusCodes } from "http-status-codes";

@injectable()
export class MicropostsService implements IMicropostsService {
  public async getData(): Promise<Micropost[]> {
    return db.micropost.findMany();
  }

  public async getOneData(id: string): Promise<Micropost | null> {
    return db.micropost.findUnique({
      where: { id: parseInt(id) },
    });
  }

  public async createOne(micropost: Omit<Micropost, "id" | "created_at" | "updated_at">): Promise<Micropost> {
    try {
      // Check if the user exists
      const user = await db.user.findUnique({ where: { id: micropost.user_id } });
      if (!user) {
        throw new AppError("User not found", StatusCodes.BAD_REQUEST);
      }

      console.log('Creating micropost:', micropost);
      const createdMicropost = await db.micropost.create({
        data: micropost,
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
      throw new AppError("Failed to create micropost", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}