import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/verify-code", authController.verifyCode);
router.post("/auth/refresh-token", authController.refreshToken);

router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected content accessed" });
});

export { router };
