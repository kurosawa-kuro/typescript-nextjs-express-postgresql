import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { app } from '../../src/app/app';
import { UsersService } from '../../src/app/services/users.service';
import { pool, query } from '../../src/app/config/dbClient';

jest.setTimeout(30000); // テストのタイムアウト時間を30秒に設定

describe('Users E2E Tests', () => {
  let usersService: UsersService;
  let client: any;

  beforeAll(() => {
    usersService = new UsersService(query);
  });

  beforeEach(async () => {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('TRUNCATE "User" RESTART IDENTITY CASCADE');
  });

  afterEach(async () => {
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      await client.query('BEGIN');
      await usersService.createOne({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: null
      });
      await client.query('COMMIT');

      const response = await request(app).get('/users');
      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user', async () => {
      await client.query('BEGIN');
      const newUser = {
        name: 'Test User',
        email: 'test.e2e@example.com',
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: 'E2E test user'
      };

      const createdUser = await usersService.createOne(newUser);
      await client.query('COMMIT');

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