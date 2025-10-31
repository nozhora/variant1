import { app } from "./app.js";
import { closeDB, initializeDatabase } from "./utils/db.js";

const port = 3000;

await initializeDatabase();

process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
