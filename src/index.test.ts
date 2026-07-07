import { describe, it, expect } from "vitest";
import app from "./index.ts";
import request from "supertest";

function sum_number(a: number, b: number) {
  return a + b;
}

describe("Test sum_number function", () => {
  it("should add two numbers correctly", () => {
    const result = sum_number(1, 2);
    expect(result).toBe(3);
  });
});

describe("GET /todo", () => {
  it("should return all todos", async () => {
    const res = await request(app).get("/todo").send();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
