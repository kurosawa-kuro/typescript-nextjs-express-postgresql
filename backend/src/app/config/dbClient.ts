// src/app/config/dbClient.ts

import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // 本番環境で自己署名証明書を使用している場合
  } : false // 開発環境ではSSLを無効にする
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

// テストスイートの前後でデータベースをクリーンアップ
beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

// 各テストの前にデータベースをクリーンアップ
beforeEach(async () => {
  await cleanDatabase();
});

async function cleanDatabase() {
  // すべてのテーブルを空にする
  await query('TRUNCATE "User", "Micropost" RESTART IDENTITY CASCADE;');
}

afterEach(async () => {
  if (expect.getState().currentTestName?.includes('failed')) {
    console.log('Test failed. Current database state:');
    const users = await query('SELECT * FROM "User"');
    console.log('Users:', users.rows);
    const microposts = await query('SELECT * FROM "Micropost"');
    console.log('Microposts:', microposts.rows);
  }
});
