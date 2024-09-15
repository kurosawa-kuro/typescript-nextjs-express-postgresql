import request from "supertest";
import app from "../src/app";
import { StatusCodes } from "http-status-codes";
import { User } from "../src/schemas/users.schema";
import userList from "../mockData/users";
import { UsersServices } from "../src/services/users.service";

const requiredFields = ["id", "name", "lastName", "email", "birthDate"];
const mockedUser = {
  name: "Vic",
  lastName: "Lop",
  email: "some@example.com",
  birthDate: new Date("2024-12-12"),
};
const mockedUserWithWrongData = {
  name: "V",
  email: "som",
  birthDate: "2024-12-12",
};

afterEach(() => {
  jest.spyOn(UsersServices, "getData").mockRestore();
  jest.spyOn(UsersServices, "getOneData").mockRestore();
  jest.spyOn(UsersServices, "createOne").mockRestore();
  jest.spyOn(UsersServices, "updateOne").mockRestore();
  jest.spyOn(UsersServices, "deleteOne").mockRestore();
});

describe("GET wrong path /notfound", function () {
  test("should respond with not found page", async () => {
    const response = await request(app).get("/notfound");
    expect(response.status).toEqual(StatusCodes.NOT_FOUND);
  });
});

describe("GET path /users", function () {
  test("should handle error in get", async () => {
    jest
      .spyOn(UsersServices, "getData")
      .mockRejectedValue(new Error("Test error"));
    const response = await request(app).get("/users");
    expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  test("should respond with status code 200", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toEqual(StatusCodes.OK);
  });
  test("should respond in json format", async () => {
    const response = await request(app).get("/users");
    expect(response.headers["content-type"]).toMatch(/json/);
  });
  test("should respond an array with more than one element", async () => {
    const response = await request(app).get("/users");
    expect(Array.isArray(response.body)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
  test("should respond with all the required properties", async () => {
    const response = await request(app).get("/users");
    const userReceived: User = (response.body as User[])[0];
    expect(Array.isArray(response.body)).toBe(true);
    expect(Object.keys(userReceived)).toEqual(
      expect.arrayContaining(requiredFields),
    );
  });
  test("should respond only required fields", async () => {
    const response = await request(app).get("/users");
    const userReceived: User = (response.body as User[])[0];
    expect(Array.isArray(response.body)).toBe(true);
    expect(requiredFields).toEqual(
      expect.arrayContaining(Object.keys(userReceived)),
    );
  });
});

describe("GET path /users/:id", function () {
  test("should handle error in getOne", async () => {
    jest
      .spyOn(UsersServices, "getOneData")
      .mockRejectedValue(new Error("Test error"));
    const response = await request(app).get(
      "/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
    );
    expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  describe("With invalid or unexisting id", function () {
    test("should respond with status code 400", async () => {
      const response = await request(app).get("/users/999999");
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    });
    test("should respond with status code 404 (not found)", async () => {
      const response = await request(app).get(
        "/users/2223b90d-c5f8-41ef-8162-53de1cffc44e",
      );
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({});
    });
  });
  describe("With valid id", function () {
    test("should respond with status code 200", async () => {
      const response = await request(app).get(
        "/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
      );
      expect(response.status).toEqual(StatusCodes.OK);
    });
    test("should respond in json format", async () => {
      const response = await request(app).get(
        "/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
      );
      expect(response.headers["content-type"]).toMatch(/json/);
    });
    test("should respond with all the required properties", async () => {
      const response = await request(app).get(
        "/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
      );
      const userReceived = response.body as User;
      expect(Object.keys(userReceived)).toEqual(
        expect.arrayContaining(requiredFields),
      );
    });
    test("should respond only required fields", async () => {
      const response = await request(app).get(
        "/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
      );
      const userReceived: User = response.body as User;
      expect(requiredFields).toEqual(
        expect.arrayContaining(Object.keys(userReceived)),
      );
    });
  });
});

describe("POST path /users", function () {
  test("should handle error in POST", async () => {
    jest
      .spyOn(UsersServices, "createOne")
      .mockRejectedValue(new Error("Test error"));
    const response = await request(app).post("/users").send(mockedUser);
    expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  describe("With invalid data", function () {
    test("should respond with status code 400", async () => {
      const response = await request(app)
        .post("/users")
        .send(mockedUserWithWrongData);
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toEqual({});
    });
  });
  describe("With valid id", function () {
    test("should respond with status code 201", async () => {
      const response = await request(app).post("/users").send(mockedUser);
      expect(response.status).toEqual(StatusCodes.CREATED);
    });
    test("should respond in json format", async () => {
      const response = await request(app).post("/users").send(mockedUser);
      expect(response.headers["content-type"]).toMatch(/json/);
    });
    test("should respond with all the required properties", async () => {
      const response = await request(app).post("/users").send(mockedUser);
      const userReceived = response.body as User;
      expect(Object.keys(userReceived)).toEqual(
        expect.arrayContaining(requiredFields),
      );
    });
    test("should respond only required fields", async () => {
      const response = await request(app).post("/users").send(mockedUser);
      const userReceived = response.body as User;
      expect(requiredFields).toEqual(
        expect.arrayContaining(Object.keys(userReceived)),
      );
    });
  });
});

describe("PUT path /users", function () {
  test("should handle error in PUT and give status code 500", async () => {
    jest
      .spyOn(UsersServices, "updateOne")
      .mockRejectedValue(new Error("Test error"));
    const response = await request(app)
      .put("/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3")
      .send(mockedUser);
    expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  describe("With invalid or unexisting id", function () {
    test("should respond with status code 400, wrong ID", async () => {
      const response = await request(app).put("/users/999999");
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    });
    test("should respond with status code 400, wrong fields", async () => {
      const response = await request(app)
        .put("/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3")
        .send(mockedUserWithWrongData);
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).not.toEqual({});
    });
    test("should respond with status code 404 (not found)", async () => {
      const response = await request(app)
        .put("/users/2223b90d-c5f8-41ef-8162-53de1cffc44e")
        .send(mockedUser);
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body).toEqual({});
    });
  });
  describe("With valid id", function () {
    test("should respond with status code 200", async () => {
      const response = await request(app)
        .put("/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3")
        .send(mockedUser);
      expect(response.status).toEqual(StatusCodes.OK);
    });
    test("should respond in json format", async () => {
      const response = await request(app)
        .put("/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3")
        .send(mockedUser);
      expect(response.headers["content-type"]).toMatch(/json/);
    });
    test("should respond with all the required properties", async () => {
      const response = await request(app)
        .put("/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3")
        .send(mockedUser);
      const userReceived = response.body as User;
      expect(Object.keys(userReceived)).toEqual(
        expect.arrayContaining(requiredFields),
      );
    });
    test("should respond only required fields", async () => {
      const response = await request(app)
        .put("/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3")
        .send(mockedUser);
      const userReceived = response.body as User;
      expect(requiredFields).toEqual(
        expect.arrayContaining(Object.keys(userReceived)),
      );
    });
  });
});

describe("DELETE path /users", function () {
  test("should handle error in DELETE and give status code 500", async () => {
    jest
      .spyOn(UsersServices, "deleteOne")
      .mockRejectedValue(new Error("Test error"));
    const response = await request(app).delete(
      "/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
    );
    expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  describe("With invalid or unexisting id", function () {
    test("should respond with status code 400, wrong ID", async () => {
      const response = await request(app).delete("/users/999999");
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    });
    test("should respond with status code 404 (not found)", async () => {
      const response = await request(app).delete(
        "/users/2223b90d-c5f8-41ef-8162-53de1cffc44e",
      );
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
    });
  });
  describe("With valid id", function () {
    test("should respond with status code 204", async () => {
      const response = await request(app).delete(
        "/users/cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
      );
      const result = userList.some(
        (user) => user.id === "cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
      );
      expect(result).toEqual(false);
      expect(response.status).toEqual(StatusCodes.NO_CONTENT);
    });
  });
});
