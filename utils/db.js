import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_URL || "./app.sqlite",
  logging: false,
});

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await import("../models/user.model.js");

    await sequelize.sync();
    return { sequelize };
  } catch (err) {
    throw err;
  }
};

const closeDB = async () => {
  await sequelize.close();
};

export { closeDB, initializeDatabase, sequelize };
