// src/app/services/microposts.service.ts

import { injectable } from 'inversify';
import { query } from '../config/dbClient';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorMiddleware';

@injectable()
export class MicropostsService {
  async getData() {
    try {
      const { rows } = await query('SELECT * FROM "Micropost"');
      return rows;
    } catch (error) {
      console.error('Error in getData:', error);
      throw new AppError('Failed to get microposts', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getOneData(id: string) {
    try {
      const { rows } = await query('SELECT * FROM "Micropost" WHERE id = $1', [id]);
      if (rows.length === 0) {
        throw new AppError('Micropost not found', StatusCodes.NOT_FOUND);
      }
      return rows[0];
    } catch (error) {
      console.error('Error in getOneData:', error);
      throw new AppError('Failed to get micropost', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createOne(micropost: { user_id: number; title: string; content: string; image_path: string }) {
    try {
      const { rows } = await query(
        'INSERT INTO "Micropost" (user_id, title, content, image_path, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
        [micropost.user_id, micropost.title, micropost.content, micropost.image_path]
      );
      return rows[0];
    } catch (error) {
      console.error('Error creating micropost:', error);
      throw new AppError('Failed to create micropost', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
