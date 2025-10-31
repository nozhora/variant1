import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET || "access-secret-example",
    async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid access token" });
      }

      // Ensure the user still exists in the database
      try {
        const dbUser = await User.findByPk(user.id);
        if (!dbUser) {
          return res.status(401).json({ message: "User not found" });
        }
      } catch (e) {
        console.error("DB error in auth middleware:", e);
        return res.status(500).json({ message: "Internal server error" });
      }

      req.user = user;
      next();
    }
  );
};

export { authMiddleware };
