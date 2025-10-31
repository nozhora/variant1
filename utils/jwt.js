import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret-example";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh-secret-example";

function generateAccessToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn });
}

function generateRefreshToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
