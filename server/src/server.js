import http from "http";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { seedInitialData } from "./seed.js";
import { attachSocket } from "./socket.js";

const app = createApp();
const server = http.createServer(app);
const io = attachSocket(server);

app.set("io", io);

async function start() {
  await connectDb();
  await seedInitialData();
  server.listen(env.port, () => {
    console.log(`Be Social API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
