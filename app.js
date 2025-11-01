import { config } from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { router } from "./routes/index.js";

config();

export const app = express();

// parse JSON bodies
app.use(express.json());

// application routes
app.use("/api", router);

app.use(errorMiddleware);
