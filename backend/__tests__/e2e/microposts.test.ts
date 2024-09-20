import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../../src/app/app';
import { container } from '../../src/app/inversify.config';
import { TYPES } from '../../src/app/types/types';
import { IMicropostsService, IUsersService } from '../../src/app/types/interfaces';
import { query } from '../../src/app/config/dbClient';

describe('Microposts E2E Tests', () => {
  let micropostsService: IMicropostsService;
  let usersService: IUsersService;

  beforeAll(async () => {
    micropostsService = container.get<IMicropostsService>(TYPES.MicropostsService);
    usersService = container.get<IUsersService>(TYPES.UsersService);
  });

  beforeEach(async () => {
    await query('TRUNCATE "User", "Micropost" RESTART IDENTITY CASCADE;');
  });

  afterEach(async () => {
    await query('TRUNCATE "User", "Micropost" RESTART IDENTITY CASCADE;');
  });

  describe('GET /microposts', () => {
    it('should return all microposts', async () => {
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
      const testUser = await usersService.createOne({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password_hash: 'hashedpassword123',
        is_admin: false,
        memo: null
      });
      const newMicropost = {
        user_id: testUser.id,
        title: 'New Micropost',
        content: 'This is a new micropost'
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
