import { describe, expect, test } from "vitest";
import { generateAccessToken, verifyAccessToken } from "../utils/jwt.js";

describe("JWT utils", () => {
  test("generate and verify access token", () => {
    const payload = { id: 1, email: "test@example.com" };
    const token = generateAccessToken(payload, "1h");
    const decoded = verifyAccessToken(token);

    expect(decoded).toMatchObject({ id: 1, email: "test@example.com" });
  });
});
