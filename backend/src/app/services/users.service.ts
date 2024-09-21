import { IUsersService } from '../types/interfaces';
import { QueryResult } from 'pg';

interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_admin: boolean;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
}

export class UsersService implements IUsersService {
  constructor(private query: (text: string, params?: any[]) => Promise<QueryResult>) {}

  public async getData(): Promise<User[]> {
    const { rows } = await this.query('SELECT * FROM "User"');
    return rows;
  }

  public async getOneData(id: string): Promise<User | null> {
    const { rows } = await this.query('SELECT * FROM "User" WHERE id = $1', [id]);
    return rows[0] || null;
  }

  public async createOne(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const { rows } = await this.query(
      'INSERT INTO "User" (name, email, password_hash, is_admin, memo, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [user.name, user.email, user.password_hash, user.is_admin, user.memo || null]
    );
    return rows[0];
  }
}