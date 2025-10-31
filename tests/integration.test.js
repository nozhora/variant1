import { describe, test, expect, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../app.js";
import { User } from "../models/user.model.js";
import { initializeDatabase, closeDB } from "../utils/db.js";

describe("Integration Tests", () => {
  let mockUser;
  const testUserData = {
    email: "test@example.com",
    password: "testpassword123",
  };

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await User.destroy({ where: { email: testUserData.email } });

    const hashedPassword = await bcrypt.hash(testUserData.password, 10);
    mockUser = await User.create({
      email: testUserData.email,
      password: hashedPassword,
    });
  });

  afterEach(async () => {
    // Clean up test user after each test
    await User.destroy({ where: { email: testUserData.email } });
  });

  afterAll(async () => {
    await closeDB();
  });

  describe("Authentication Flow", () => {
    test("POST /api/auth/register should create new user", async () => {
      const newUserData = {
        email: "newuser@example.com",
        password: "newpassword123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(newUserData)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Verification code sent to email"
      );

      // Clean up
      await User.destroy({ where: { email: newUserData.email } });
    });
  });
});
