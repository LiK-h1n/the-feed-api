const request = require("supertest");
const app = require("../index");

describe("API Sanity Check", () => {
  it("should return a welcome message on the root route", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Welcome to TheFeed API");
  });
});
