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
    await db.micropost.deleteMany();
    await db.user.deleteMany();

    // Create a test user
    const testUser = await usersService.createOne({
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Use unique email
      password_hash: 'hashedpassword123',
      is_admin: false,
      memo: null
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    // Final cleanup
    await db.micropost.deleteMany();
    await db.user.deleteMany();
  });

  describe('GET /microposts', () => {
    it('should return all microposts', async () => {
      // Create a test micropost
      await micropostsService.createOne({
        user_id: testUserId,
        title: 'Test Micropost',
        content: 'This is a test micropost',
        image_path: null
      });

      const response = await request(app).get('/microposts');
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

      const response = await request(app).get(`/microposts/${createdMicropost.id}`);
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
        title: 'New Micropost',
        content: 'This is a new micropost for E2E testing',
        image_path: '/images/new.jpg'
      };

      const response = await request(app)
        .post('/microposts')
        .send(newMicropost);

      console.log('Response status:', response.status);
      console.log('Response body:', response.body);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        ...newMicropost,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });

      // Verify the created micropost can be retrieved
      const getResponse = await request(app).get(`/microposts/${response.body.id}`);
      expect(getResponse.status).toBe(StatusCodes.OK);
      expect(getResponse.body).toMatchObject(newMicropost);
    });

    it('should return 400 for invalid micropost data', async () => {
      const invalidMicropost = {
        user_id: testUserId,
        title: '', // Empty title
        content: 'This micropost has an invalid title',
      };

      const response = await request(app)
        .post('/microposts')
        .send(invalidMicropost);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return 400 for micropost with non-existent user_id', async () => {
      const invalidMicropost = {
        user_id: 9999, // Non-existent user_id
        title: 'Invalid User Micropost',
        content: 'This micropost has a non-existent user_id',
      };

      const response = await request(app)
        .post('/microposts')
        .send(invalidMicropost);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});