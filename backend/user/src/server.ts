import {Server} from "http";
import app from "./app.js";
import {env} from "./app/env/index.js";
import {connectDatabase, disconnectDatabase} from "./app/config/database.js";
import {connectRedis} from "./app/config/redis.js";
import superUser from "./app/utils/superUser.js";
import { connectRabbitMQ } from "./app/config/rabbitmq.js";
import { connectNotificationServer } from "./app/config/nodemailer.js";

let server: Server;

async function main() {
  try {
    await connectDatabase();

    await connectRedis();

    await connectRabbitMQ();

    await connectNotificationServer();

    server = app.listen(env.port, () => {
      console.log(`✅ User server is listening on port ${env.port}`);
    });
  } catch (err) {
    console.log("😈 User server error, shutting down ...", err);
  }
}

(async () => {
  await main();
  await superUser();
})();

const gracefulShutdown = async () => {
  console.log("⚠️ Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("❌ HTTP server closed");
    });
  }
  await disconnectDatabase();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

process.on("unhandledRejection", async (err) => {
  console.log("😈 Unhandled rejection:", err);
  await gracefulShutdown();
});

process.on("uncaughtException", async (err) => {
  console.log("😈 Uncaught exception:", err);
  await gracefulShutdown();
});
