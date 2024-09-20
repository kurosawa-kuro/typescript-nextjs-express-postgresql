// backend/src/app/services/users.service.ts

import { injectable } from 'inversify';
import { query } from '../config/dbClient';
import { IUsersService } from '../types/interfaces';
import { User } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService {
  public async getData(): Promise<User[]> {
    const { rows } = await query('SELECT * FROM "User"'); // Ensure table name is correctly quoted
    return rows;
  }

  public async getOneData(id: string): Promise<User | null> {
    const { rows } = await query('SELECT * FROM "User" WHERE id = $1', [id]);
    return rows[0] || null;
  }

  public async createOne(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const { rows } = await query(
      'INSERT INTO "User" (name, email, password_hash, is_admin, memo, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [user.name, user.email, user.password_hash, user.is_admin, user.memo || null] // Ensure all fields are included correctly
    );
    return rows[0];
  }
}
