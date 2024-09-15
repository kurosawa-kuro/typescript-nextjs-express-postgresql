import request from "supertest";
import app from "../src/app";
import { StatusCodes } from "http-status-codes";

describe("GET path / (home)", () => {
  test("should respond with status code 200", async () => {
    const result = await request(app).get("/");
    expect(result.status).toEqual(StatusCodes.OK);
  });
  test("should respond in json format", async () => {
    const result = await request(app).get("/");
    expect(result.headers["content-type"]).toMatch(/json/);
  });
  test("should respond with a body", async () => {
    const result = await request(app).get("/");
    expect(result.body).toBe("This is the home Page");
  });
});
