import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { app } from '../../src/app/app';
import { MicropostsService } from '../../src/app/services/microposts.service';
import { UsersService } from '../../src/app/services/users.service';
import { pool, query } from '../../src/app/config/dbClient';

jest.setTimeout(30000); // テストのタイムアウト時間を30秒に設定

describe('Microposts E2E Tests', () => {
  let micropostsService: MicropostsService;
  let usersService: UsersService;
  let client: any;

  beforeAll(() => {
    micropostsService = new MicropostsService(query);
    usersService = new UsersService(query);
  });

  beforeEach(async () => {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query('TRUNCATE "User", "Micropost" RESTART IDENTITY CASCADE');
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

  describe('GET /microposts', () => {
    it('should return all microposts', async () => {
      await client.query('BEGIN');
      const testUser = await usersService.createOne({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: null
      });

      await micropostsService.createOne({
        user_id: testUser.id,
        title: 'Test Micropost',
        content: 'This is a test micropost',
        image_path: 'This is a image_path'
      });
      await client.query('COMMIT');

      const response = await request(app).get('/microposts');
      expect(response.status).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /microposts/:id', () => {
    it('should return a specific micropost', async () => {
      await client.query('BEGIN');
      const testUser = await usersService.createOne({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: null
      });
      const newMicropost = {
        user_id: testUser.id,
        title: 'Specific Micropost',
        content: 'This is a specific micropost for E2E testing',
        image_path: '/images/test.jpg'
      };
      const createdMicropost = await micropostsService.createOne(newMicropost);
      await client.query('COMMIT');

      const response = await request(app).get(`/microposts/${createdMicropost.id}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        ...newMicropost,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });
    });
  });

  describe('POST /microposts', () => {
    it('should create a new micropost', async () => {
      await client.query('BEGIN');
      const testUser = await usersService.createOne({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: null
      });
      await client.query('COMMIT');

      const newMicropost = {
        user_id: testUser.id,
        title: 'New Micropost',
        content: 'This is a new micropost',
        image_path: null
      };

      const response = await request(app)
        .post('/microposts')
        .send(newMicropost);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toMatchObject({
        ...newMicropost,
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });
    });
  });
});