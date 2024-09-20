// __tests__/prismaClient.test.ts

import { PrismaClient } from '@prisma/client';

describe('PrismaClient initialization', () => {
  const originalEnv = process.env;
  let mockPrismaClient: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockPrismaClient = jest.fn();
    jest.mock('@prisma/client', () => ({
      PrismaClient: mockPrismaClient,
    }));
    global.__db = undefined;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetAllMocks();
  });

  it('should create a new PrismaClient instance in test environment', () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'test_database_url';
    
    const { db } = require('../../prisma/prismaClient');
    
    expect(mockPrismaClient).toHaveBeenCalledWith({
      datasources: {
        db: {
          url: 'test_database_url',
        },
      },
    });
    expect(db).toBeInstanceOf(mockPrismaClient);
    expect(global.__db).toBeUndefined();
  });

  it('should create a new PrismaClient instance if global.__db is undefined', () => {
    process.env.NODE_ENV = 'development';
    
    const { db } = require('../../prisma/prismaClient');
    
    expect(mockPrismaClient).toHaveBeenCalledWith();
    expect(db).toBeInstanceOf(mockPrismaClient);
    expect(global.__db).toBeInstanceOf(mockPrismaClient);
  });
});