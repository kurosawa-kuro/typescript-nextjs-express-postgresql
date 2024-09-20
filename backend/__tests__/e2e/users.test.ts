import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../src/app/app';
import { container } from '../../src/app/inversify.config';
import { TYPES } from '../../src/app/types/types';
import { IUsersService } from '../../src/app/types/interfaces';
import { query } from '../../src/app/config/dbClient';

describe('Users E2E Tests', () => {
  let usersService: IUsersService;

  beforeAll(async () => {
    usersService = container.get<IUsersService>(TYPES.UsersService);
  });

  beforeEach(async () => {
    await query('TRUNCATE "User" RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    await query('TRUNCATE "User" RESTART IDENTITY CASCADE;');
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      await usersService.createOne({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: null
      });

      const response = await request(app).get('/users');
      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test.e2e@example.com',
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: 'E2E test user'
      };

      const createdUser = await usersService.createOne(newUser);
      const response = await request(app).get(`/users/${createdUser.id}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject(newUser);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/users/9999');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: `new.user.e2e${Date.now()}@example.com`,
        password_hash: 'hashedpassword456',
        is_admin: true,
        memo: 'E2E test new user'
      };

      const response = await request(app)
        .post('/users')
        .send(newUser);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        ...newUser,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });

      // Verify the created user can be retrieved
      const getResponse = await request(app).get(`/users/${response.body.id}`);
      expect(getResponse.status).toBe(StatusCodes.OK);
      expect(getResponse.body).toMatchObject(newUser);
    });

    it('should return 400 for invalid user data', async () => {
      const invalidUser = {
        name: 'Invalid',
        email: 'invalid.email',  // Invalid email
        password_hash: 'short',  // Too short password hash
      };

      const response = await request(app)
        .post('/users')
        .send(invalidUser);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
