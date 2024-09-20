// backend/__tests__/microposts.controller.test.ts

import { StatusCodes } from "http-status-codes";
import { MicropostsController } from "../../src/app/controllers/microposts.controller";
import { IMicropostsService } from "../../src/app/types/interfaces";
import { AppError } from "../../src/app/utils/errorMiddleware";
import { Micropost } from "@prisma/client";

// モックのMicropostsServiceを作成
const mockMicropostsService: jest.Mocked<IMicropostsService> = {
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

describe("MicropostsController", () => {
  let micropostsController: MicropostsController;

  beforeEach(() => {
    micropostsController = new MicropostsController(mockMicropostsService);
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should return microposts data with status 200", async () => {
      const mockMicroposts: Micropost[] = [{
          id: 1,
          content: "Test Micropost",
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          title: "",
          image_path: null
      }];
      mockMicropostsService.getData.mockResolvedValue(mockMicroposts);

      await micropostsController.get(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMicroposts);
    });

    it("should call next with AppError when service throws an error", async () => {
      const error = new Error("Test error");
      mockMicropostsService.getData.mockRejectedValue(error);

      await micropostsController.get(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("getOne", () => {
    it("should return micropost data with status 200 when micropost is found", async () => {
      const mockMicropost: Micropost = {
          id: 1,
          content: "Test Micropost",
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          title: "",
          image_path: null
      };
      mockMicropostsService.getOneData.mockResolvedValue(mockMicropost);
      mockRequest.params = { id: "1" };

      await micropostsController.getOne(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMicropost);
    });

    it("should call next with AppError when micropost is not found", async () => {
      mockMicropostsService.getOneData.mockResolvedValue(null);
      mockRequest.params = { id: "1" };

      await micropostsController.getOne(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it("should call next with AppError when service throws an error", async () => {
      const error = new Error("Test error");
      mockMicropostsService.getOneData.mockRejectedValue(error);
      mockRequest.params = { id: "1" };

      await micropostsController.getOne(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("createOne", () => {
    it("should create micropost and return with status 201", async () => {
      const mockMicropost: Micropost = {
          id: 1,
          content: "Test Micropost",
          user_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          title: "",
          image_path: null
      };
      mockMicropostsService.createOne.mockResolvedValue(mockMicropost);
      mockRequest.body = {
        content: "Test Micropost",
        user_id: 1,
      };

      await micropostsController.createOne(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMicropost);
    });

    it("should call next with AppError when service throws an error", async () => {
      const error = new Error("Test error");
      mockMicropostsService.createOne.mockRejectedValue(error);
      mockRequest.body = {
        content: "Test Micropost",
        user_id: 1,
      };

      await micropostsController.createOne(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});