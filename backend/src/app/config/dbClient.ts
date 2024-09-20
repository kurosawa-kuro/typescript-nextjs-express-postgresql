// src/app/config/dbClient.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // 本番環境で自己署名証明書を使用している場合
  } : false // 開発環境ではSSLを無効にする
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
