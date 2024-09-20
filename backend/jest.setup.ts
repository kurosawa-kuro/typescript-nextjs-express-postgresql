// backend/jest.setup.ts

import 'reflect-metadata';
import { db } from './prisma/prismaClient';
import { execSync } from 'child_process';
import { beforeAll, afterAll } from '@jest/globals';

beforeAll(async () => {
  // テスト用DBのマイグレーションを実行
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

afterAll(async () => {
  await db.$disconnect();
});