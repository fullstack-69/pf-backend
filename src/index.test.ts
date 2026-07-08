import { describe, it, expect, beforeAll } from "vitest";
import app from "./index.ts";
import request from "supertest";
import { dbClient } from "@db/client.js";
import { todoTable } from "@db/schema.js";
import Debug from "debug";

const debug = Debug("pf-test:index.test.ts");

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
  beforeAll(async () => {
    debug("Setting up database connection...");
    // Clear database before running tests
    await dbClient.delete(todoTable);
    await dbClient
      .insert(todoTable)
      .values({ todoText: "Item 1", isDone: false });
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
      expect.arrayContaining([
        expect.objectContaining({ todoText: "Item 1", isDone: false }),
      ]),
    );
  });

  it("should update todo item", async () => {
    // First, get the existing todos to find the last one
    const todos = await dbClient.query.todoTable.findMany();
    if (todos.length === 0) {
      throw new Error("No todos found to update");
    }
    const todo = todos[todos.length - 1];
    // Now, send a PATCH request to update the last todo item
    const resPatch = await request(app)
      .patch("/todo")
      .send({ id: todo.id, todoText: "Updated Item 1" });
    expect(resPatch.status).toBe(200);
    // After updating, fetch the todos again to verify the update
    const resGet = await request(app).get("/todo").send();
    const todoEdited = resGet.body.find((t: any) => t.id === todo.id);
    expect(todoEdited).toEqual(
      expect.objectContaining({ todoText: "Updated Item 1" }),
    );
  });
});
