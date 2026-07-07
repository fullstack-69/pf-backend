import { describe, it, expect } from "vitest";
import app from "./index.ts";
import request from "supertest";

describe("math tests", () => {
  it("adds 1 + 2 to equal 3", () => {
    expect(1 + 2).toBe(3);
  });
});

describe("GET /todo", () => {
  it("should create a user when valid payload is passed", async () => {
    const res = await request(app).get("/todo").send();

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test@example.com");
  });
});
