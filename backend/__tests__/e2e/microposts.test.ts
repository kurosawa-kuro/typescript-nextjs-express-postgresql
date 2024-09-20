// __tests__/e2e/microposts.test.ts

import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../src/app/app';
import { container } from '../../src/app/inversify.config';
import { TYPES } from '../../src/app/types/types';
import { IMicropostsService, IUsersService } from '../../src/app/types/interfaces';
import { db } from '../../prisma/prismaClient';
import { User } from '@prisma/client';

describe('Microposts E2E Tests', () => {
  let micropostsService: IMicropostsService;
  let usersService: IUsersService;
  let testUserId: number;  // テストユーザーのIDを保持する変数
  let testUserEmail: string;  // テストユーザーのメールアドレスを保持する変数

  beforeAll(async () => {
    micropostsService = container.get<IMicropostsService>(TYPES.MicropostsService);
    usersService = container.get<IUsersService>(TYPES.UsersService);
    await db.$connect();
  });

  beforeEach(async () => {
    await db.micropost.deleteMany();
    await db.user.deleteMany();
    await db.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Micropost', 'User');`;

    const testUser: User = await db.user.create({
      data: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: null,
      },
    });
    testUserId = testUser.id;  // ユーザーのIDを保存
    testUserEmail = testUser.email;  // ユーザーのメールアドレスを保存
  });
  afterEach(async () => {
    await db.$executeRaw`DELETE FROM Micropost`;
    await db.$executeRaw`DELETE FROM User`;
    await db.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Micropost', 'User')`;
    
  });

  afterAll(async () => {
    await db.$executeRaw`DELETE FROM Micropost`;
    await db.$executeRaw`DELETE FROM User`;
    await db.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Micropost', 'User')`;
    await db.$disconnect();
  });

  describe('GET /microposts', () => {
    it('should return all microposts', async () => {
      console.log('testUserId:', testUserId);
      console.log('testUserEmail:', testUserEmail);
      const testUser: User = await db.user.create({
        data: {
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password_hash: 'hashedpassword123',
          is_admin: false,
          memo: null,
        },
      });
      // サービスではなく直接全てのユーザーを取得
      const users = await db.user.findMany();

      console.log('users:', users);

      const user = await db.user.findUnique({
        where: { email: testUser.email },
      });
      console.log('user:', user);

      if (!user) {
        throw new Error('User not found');
      }
      console.log('user.id:', user.id);
      const user_id = user.id;
      const result = await micropostsService.createOne({
        user_id: testUser.id, // テストユーザーのIDを使用
        title: 'Test Micropost',
        content: 'This is a test micropost',
        image_path: null,
      });

      const response = await request(app).get('/microposts');
      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /microposts/:id', () => {
    it('should return a specific micropost', async () => {
      const testUser: User = await db.user.create({
        data: {
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password_hash: 'hashedpassword123',
          is_admin: false,
          memo: null,
        },
      });
      const newMicropost = {
        user_id: testUser.id, // テストユーザーのIDを使用
        title: 'Specific Micropost',
        content: 'This is a specific micropost for E2E testing',
        image_path: '/images/test.jpg',
      };
      const createdMicropost = await micropostsService.createOne(newMicropost);

      const response = await request(app).get(`/microposts/${createdMicropost.id}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        ...newMicropost,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });
  });

  describe('POST /microposts', () => {
    it('should create a new micropost', async () => {
      const testUser: User = await db.user.create({
        data: {
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password_hash: 'hashedpassword123',
          is_admin: false,
          memo: null,
        },
      });
      const newMicropost = {
        user_id: testUser.id, // テストユーザーのIDを使用
        title: 'New Micropost',
        content: 'This is a new micropost',
      };

      const response = await request(app)
        .post('/microposts')
        .send(newMicropost);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        ...newMicropost,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });
  });

  // 他のテストケースも同様に必要に応じて修正
});
