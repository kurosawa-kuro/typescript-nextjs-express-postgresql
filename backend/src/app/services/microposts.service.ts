import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errorMiddleware';
import { QueryResult } from 'pg';

interface Micropost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image_path: string;
  created_at: Date;
  updated_at: Date;
}

export class MicropostsService {
  constructor(private query: (text: string, params?: any[]) => Promise<QueryResult>) {}

  async getData(): Promise<Micropost[]> {
    try {
      const { rows } = await this.query('SELECT * FROM "Micropost"');
      return rows;
    } catch (error) {
      console.error('Error in getData:', error);
      throw new AppError('Failed to get microposts', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getOneData(id: string): Promise<Micropost | null> {
    try {
      const { rows } = await this.query('SELECT * FROM "Micropost" WHERE id = $1', [id]);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error in getOneData:', error);
      throw new AppError('Failed to get micropost', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createOne(micropost: Omit<Micropost, "id" | "created_at" | "updated_at">): Promise<Micropost> {
    try {
      const { rows } = await this.query(
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