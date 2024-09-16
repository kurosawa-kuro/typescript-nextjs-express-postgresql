// __tests__/logger.test.ts

import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { logger, default as loggerMiddleware } from '@/app/utils/logger';

// Mockオブジェクトを作成
jest.mock('winston', () => ({
  format: {
    printf: jest.fn(),
    combine: jest.fn(),
    timestamp: jest.fn(),
    colorize: jest.fn(),
    json: jest.fn(),
  },
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    add: jest.fn(),
  })),
  transports: {
    File: jest.fn(),
    Console: jest.fn(),
  },
}));

describe('logger', () => {
  it('should create a logger with correct configuration', () => {
    expect(winston.createLogger).toHaveBeenCalledWith(expect.objectContaining({
      level: 'info',
      defaultMeta: { service: 'some service' },
    }));
  });

  it('should add console transport in non-production environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // Re-require the module to trigger the condition
    jest.resetModules();
    require('@/app/utils/logger');

    expect(logger.add).toHaveBeenCalled();

    process.env.NODE_ENV = originalNodeEnv;
  });
});

describe('loggerMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test?param=value',
    };
    mockResponse = {
      statusCode: 200,
    };
    mockNext = jest.fn();
  });

  it('should log request information', () => {
    loggerMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(logger.info).toHaveBeenCalledWith('Method: GET path: /test Status: 200');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle requests without query parameters', () => {
    mockRequest.url = '/test';
    loggerMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(logger.info).toHaveBeenCalledWith('Method: GET path: /test Status: 200');
  });

  it('should handle different HTTP methods and status codes', () => {
    mockRequest.method = 'POST';
    mockResponse.statusCode = 201;
    loggerMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(logger.info).toHaveBeenCalledWith('Method: POST path: /test Status: 201');
  });
});