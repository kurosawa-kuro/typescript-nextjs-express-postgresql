// __tests__/errorMiddleware.test.ts

import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import errorMiddleware, { AppError } from '@/app/utils/errorMiddleware';
import { logger } from '@/app/utils/logger';

// Mockオブジェクトを作成
jest.mock('@/app/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('errorMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    console.log = jest.fn(); // コンソールログをモック化
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle AppError correctly', () => {
    const appError = new AppError('Test error', StatusCodes.BAD_REQUEST);
    errorMiddleware(appError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Test error',
        status: StatusCodes.BAD_REQUEST,
        stack: expect.any(String),
      }
    });
    expect(logger.error).toHaveBeenCalledWith(`[${StatusCodes.BAD_REQUEST}] Test error - GET /test`);
  });

  it('should handle generic Error correctly', () => {
    const genericError = new Error('Generic error');
    errorMiddleware(genericError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Generic error',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        stack: expect.any(String),
      }
    });
    expect(logger.error).toHaveBeenCalledWith(`[${StatusCodes.INTERNAL_SERVER_ERROR}] Generic error - GET /test`);
  });

  it('should use default message when error message is empty', () => {
    const emptyError = new Error();
    errorMiddleware(emptyError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        stack: expect.any(String),
      }
    });
  });

  it('should hide stack trace in production environment', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Production error');
    errorMiddleware(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Production error',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        stack: '🥞',
      }
    });

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should log console messages', () => {
    const error = new Error('Console log test');
    errorMiddleware(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(console.log).toHaveBeenCalledWith('Entering errorMiddleware');
    expect(console.log).toHaveBeenCalledWith('Error:', error);
    expect(console.log).toHaveBeenCalledWith(`Setting response status to ${StatusCodes.INTERNAL_SERVER_ERROR}`);
    expect(console.log).toHaveBeenCalledWith('Response body:', expect.any(Object));
    expect(console.log).toHaveBeenCalledWith('Exiting errorMiddleware');
  });
});