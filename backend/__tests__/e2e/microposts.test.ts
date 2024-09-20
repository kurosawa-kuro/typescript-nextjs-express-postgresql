// __tests__/e2e/microposts.test.ts

import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../src/app/app';
import { container } from '../../src/app/inversify.config';
import { TYPES } from '../../src/app/types/types';
import { IMicropostsService, IUsersService } from '../../src/app/types/interfaces';
import { db } from '../../prisma/prismaClient';

describe('Microposts E2E Tests', () => {
  let micropostsService: IMicropostsService;
  let usersService: IUsersService;
  let testUserId: number;

  beforeAll(async () => {
    micropostsService = container.get<IMicropostsService>(TYPES.MicropostsService);
    usersService = container.get<IUsersService>(TYPES.UsersService);
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await db.$executeRaw`DELETE FROM Micropost`;
    await db.$executeRaw`DELETE FROM User`;
    await db.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Micropost', 'User')`;

    // Create a test user
    const testUser = await usersService.createOne({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password_hash: 'hashedpassword123',
      is_admin: false,
      memo: null
    });
    testUserId = testUser.id;
    console.log('Created test user with ID:', testUserId);

    // Verify user creation
    const createdUser = await db.user.findUnique({ where: { id: testUserId } });
    console.log('Verified created user:', createdUser);
  });

  afterAll(async () => {
    // Final cleanup
    await db.$executeRaw`DELETE FROM Micropost`;
    await db.$executeRaw`DELETE FROM User`;
    await db.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Micropost', 'User')`;
    await db.$disconnect();
  });

  describe('GET /microposts', () => {
    it('should return all microposts', async () => {
      // Create a test micropost
      const result = await micropostsService.createOne({
        user_id: testUserId,
        title: 'Test Micropost',
        content: 'This is a test micropost',
        image_path: null
      });

      console.log('Created micropost:', result);

      // Verify micropost creation
      const createdMicropost = await db.micropost.findUnique({ where: { id: result.id } });
      console.log('Verified created micropost:', createdMicropost);

      const response = await request(app).get('/microposts');
      console.log('GET /microposts response:', response.body);
      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /microposts/:id', () => {
    it('should return a specific micropost', async () => {
      const newMicropost = {
        user_id: testUserId,
        title: 'Test Micropost',
        content: 'This is a test micropost for E2E testing',
        image_path: '/images/test.jpg'
      };
      const createdMicropost = await micropostsService.createOne(newMicropost);
      console.log('Created micropost for GET /microposts/:id test:', createdMicropost);

      // Verify micropost creation
      const verifiedMicropost = await db.micropost.findUnique({ where: { id: createdMicropost.id } });
      console.log('Verified created micropost:', verifiedMicropost);

      const response = await request(app).get(`/microposts/${createdMicropost.id}`);
      console.log('GET /microposts/:id response:', response.body);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        ...newMicropost,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });
    });

    it('should return 404 for non-existent micropost', async () => {
      const response = await request(app).get('/microposts/9999');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /microposts', () => {
    it('should create a new micropost', async () => {
      const newMicropost = {
        user_id: testUserId,
        title: 'Test Micropost',
        content: 'This is a test micropost'
      };

      const response = await request(app)
        .post('/microposts')
        .send(newMicropost);

      console.log('POST /microposts response:', response.body);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        ...newMicropost,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });

      // Verify micropost creation
      const createdMicropost = await db.micropost.findUnique({ where: { id: response.body.id } });
      console.log('Verified created micropost:', createdMicropost);
    });

    // ... 他のテストケースは変更なし
  });
});