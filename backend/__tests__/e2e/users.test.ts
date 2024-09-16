// __tests__/e2e/users.test.ts

import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../src/app/app';
import { container } from '../../src/app/inversify.config';
import { TYPES } from '../../src/app/types/types';
import { IUsersService } from '../../src/app/types/interfaces';
import { User } from '../../src/app/schemas/users.schema';

describe('Users E2E Tests', () => {
  let usersService: IUsersService;

  beforeAll(async () => {
    usersService = container.get<IUsersService>(TYPES.UsersService);
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user', async () => {
      const newUser: Omit<User, 'id'> = {
        name: 'Test User',
        lastName: 'E2E',
        email: 'test.e2e@example.com',
        birthDate: new Date(),
      };
      const createdUser = await usersService.createOne(newUser as User);

      const response = await request(app).get(`/users/${createdUser.id}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        ...newUser,
        birthDate: newUser.birthDate.toISOString(),
      });
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/users/00000000-0000-0000-0000-000000000000');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser: Omit<User, 'id'> = {
        name: 'New User',
        lastName: 'E2E Test',
        email: 'new.user.e2e@example.com',
        birthDate: new Date(),
      };

      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        ...newUser,
        birthDate: newUser.birthDate.toISOString(),
      });
      expect(response.body.id).toBeDefined();

      // 作成されたユーザーが取得できることを確認
      const getResponse = await request(app).get(`/users/${response.body.id}`);
      expect(getResponse.status).toBe(StatusCodes.OK);
      expect(getResponse.body).toMatchObject({
        ...newUser,
        birthDate: newUser.birthDate.toISOString(),
      });
    });

    it('should return 400 for invalid user data', async () => {
      const invalidUser = {
        name: 'Invalid',
        // lastName is missing
        email: 'invalid.email', // Invalid email
        birthDate: 'not-a-date',
      };

      const response = await request(app)
        .post('/users')
        .send(invalidUser);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});