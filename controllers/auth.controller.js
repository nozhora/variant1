import bcrypt from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { sendMail } from "../utils/mailer.js";

config();

class AuthController {
  async register(req, res) {
    const { email, password } = req.body;
    const row = await User.findOne({ where: { email } });

    if (row) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verify_code = code;
    const result = await user.save();
    console.log(result);

    try {
      await sendMail(
        email,
        "Veryfy your login",
        `Your verification code is: ${code}`
      );
    } catch (err) {
      console.error("Failed to send login notification email:", err);
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }
    return res.status(200).json({ message: "Verification code sent to email" });
  }
  async login(req, res) {
    const { email, password } = req.body;
    const row = await User.findOne({ where: { email } });

    if (!row) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, row.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    row.verify_code = code;
    await row.save();

    try {
      await sendMail(
        email,
        "Veryfy your login",
        `Your verification code is: ${code}`
      );
    } catch (err) {
      console.error("Failed to send login notification email:", err);
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    return res.status(200).json({ message: "Verification code sent to email" });
  }

  async verifyCode(req, res) {
    const { email, code } = req.body;
    const row = await User.findOne({ where: { email } });

    if (!row || row.verify_code !== code) {
      return res.status(401).json({ message: "Invalid email or code" });
    }

    row.verify_code = null;
    await row.save();
    const accessToken = AuthController.generateAccessToken({
      id: row.id,
      email,
    });
    const refreshToken = AuthController.generateRefreshToken({
      id: row.id,
      email,
    });

    row.refresh_token = refreshToken;
    await row.save();

    return res.status(200).json({ accessToken, refreshToken });
  }

  async logout(req, res) {
    const { email } = req.body;
    const row = await User.findOne({ where: { email } });
    if (row) {
      row.refresh_token = null;
      await row.save();
    }

    return res.status(200).json({ message: "Logged out successfully" });
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh-secret-example"
      );
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const row = await User.findByPk(payload.id);
    if (!row || row.refresh_token !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = AuthController.generateAccessToken({
      id: row.id,
      email: row.email,
    });

    const newRefreshToken = AuthController.generateRefreshToken({
      id: row.id,
      email: row.email,
    });

    row.refresh_token = newRefreshToken;
    await row.save();

    return res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  }

  static generateToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static generateAccessToken(payload) {
    return AuthController.generateToken(
      payload,
      process.env.JWT_ACCESS_SECRET || "access-secret-example",
      "15m"
    );
  }

  static generateRefreshToken(payload) {
    return this.generateToken(
      payload,
      process.env.JWT_REFRESH_SECRET || "refresh-secret-example",
      "7d"
    );
  }
}

const authController = new AuthController();
export { authController };
