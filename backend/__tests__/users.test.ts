// backend/__tests__/users.controller.test.ts

import { StatusCodes } from "http-status-codes";
import { UsersController } from "../src/app/controllers/users.controller";
import { IUsersService } from "../src/app/types/interfaces";
import { AppError } from "../src/app/utils/errorMiddleware";
import { User } from "@prisma/client";

// モックのUsersServiceを作成
const mockUsersService: jest.Mocked<IUsersService> = {
  getData: jest.fn(),
  getOneData: jest.fn(),
  createOne: jest.fn(),
};

// モックのリクエスト、レスポンス、nextオブジェクトを作成
const mockRequest = {} as any;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as any;
const mockNext = jest.fn();

describe("UsersController", () => {
  let usersController: UsersController;

  beforeEach(() => {
    usersController = new UsersController(mockUsersService);
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should return users data with status 200", async () => {
      const mockUsers: User[] = [{
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password_hash: "hashedpassword123",
        is_admin: false,
        memo: null,
        created_at: new Date(),
        updated_at: new Date(),
      }];
      mockUsersService.getData.mockResolvedValue(mockUsers);

      await usersController.get(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should call next with AppError when service throws an error", async () => {
      const error = new Error("Test error");
      mockUsersService.getData.mockRejectedValue(error);

      await usersController.get(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("getOne", () => {
    it("should return user data with status 200 when user is found", async () => {
      const mockUser: User = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password_hash: "hashedpassword123",
        is_admin: false,
        memo: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockUsersService.getOneData.mockResolvedValue(mockUser);
      mockRequest.params = { id: "1" };

      await usersController.getOne(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next with AppError when user is not found", async () => {
      mockUsersService.getOneData.mockResolvedValue(null);
      mockRequest.params = { id: "1" };

      await usersController.getOne(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it("should call next with AppError when service throws an error", async () => {
      const error = new Error("Test error");
      mockUsersService.getOneData.mockRejectedValue(error);
      mockRequest.params = { id: "1" };

      await usersController.getOne(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("createOne", () => {
    it("should create user and return with status 201", async () => {
      const mockUser: User = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password_hash: "hashedpassword123",
        is_admin: false,
        memo: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockUsersService.createOne.mockResolvedValue(mockUser);
      mockRequest.body = {
        name: "Test User",
        email: "test@example.com",
        password_hash: "hashedpassword123",
      };

      await usersController.createOne(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next with AppError when service throws an error", async () => {
      const error = new Error("Test error");
      mockUsersService.createOne.mockRejectedValue(error);
      mockRequest.body = {
        name: "Test User",
        email: "test@example.com",
        password_hash: "hashedpassword123",
      };

      await usersController.createOne(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});