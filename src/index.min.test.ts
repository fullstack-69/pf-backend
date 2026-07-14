import { describe, it, expect, beforeAll } from "vitest";
import app from "./index.js";
import request from "supertest";
import { dbClient } from "@db/client.js";
import { todoTable } from "@db/schema.js";

function sum_number(a: number, b: number) {
  return a + b;
}

describe("Test sum_number function (min)", () => {
  it("should add two numbers correctly", () => {
    const result = sum_number(1, 2);
    expect(result).toBe(3);
  });
});

describe("Todo API (min)", () => {
  beforeAll(async () => {
    // Clear database before running tests
    await dbClient.delete(todoTable);
    await dbClient.insert(todoTable).values({ todoText: "Item 1" });
  });

  it("should return all todos", async () => {
    const res = await request(app).get("/todo").send();
    // Check the response status and body
    expect(res.status).toBe(200);
    // Check that the response body is an array and has the expected length
    expect(Array.isArray(res.body)).toBe(true);
    // Check that the response body has the expected length (1 item)
    expect(res.body).toHaveLength(1);
    // Check that the response body contains the expected items
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ todoText: "Item 1" })]),
    );
  });
});
