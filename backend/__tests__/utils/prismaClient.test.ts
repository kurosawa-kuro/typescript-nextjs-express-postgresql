// __tests__/utils/prismaClient.test.ts

// __tests__/utils/prismaClient.test.ts

import { PrismaClient } from '@prisma/client';
describe('PrismaClient initialization', () => {
  const originalEnv = process.env;
  let mockPrismaClientConstructor: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, DATABASE_URL: 'test_database_url' };
    global.__db = undefined;

    // Mock the PrismaClient constructor
    mockPrismaClientConstructor = jest.fn().mockImplementation((...args) => {
      const { PrismaClient } = jest.requireActual('@prisma/client');
      return new PrismaClient(...args);
    });

    jest.mock('@prisma/client', () => ({
      PrismaClient: mockPrismaClientConstructor,
    }));
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetAllMocks();
  });

  it('should create a new PrismaClient instance and set global.__db', () => {
    const { db } = require('../../prisma/prismaClient');

    expect(mockPrismaClientConstructor).toHaveBeenCalledWith({
      datasources: {
        db: {
          url: 'test_database_url',
        },
      },
    });
    expect(db).toBe(global.__db);

    // Use the actual PrismaClient for instanceof check
    const { PrismaClient } = jest.requireActual('@prisma/client');
    expect(db).toBeInstanceOf(PrismaClient);
  });

  it('should reuse the existing PrismaClient instance from global.__db', () => {
    const { db: firstDbInstance } = require('../../prisma/prismaClient');
    const { db: secondDbInstance } = require('../../prisma/prismaClient');

    expect(mockPrismaClientConstructor).toHaveBeenCalledTimes(1);
    expect(firstDbInstance).toBe(secondDbInstance);

    // Use the actual PrismaClient for instanceof check
    const { PrismaClient } = jest.requireActual('@prisma/client');
    expect(firstDbInstance).toBeInstanceOf(PrismaClient);
  });
});
