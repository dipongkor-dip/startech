import {Server} from "http";
import app from "./app";
import {connectDatabase, disconnectDatabase} from "./app/config/database";
import env from "./app/env";
import {connectRabbitMQ} from "./app/config/rabbitmq";
import {seedCategories} from "./seed/seed";

let server: Server;

async function main() {
  try {
    // Connect to database
    await connectDatabase();

    // Connect to RabbitMQ
    await connectRabbitMQ();

    // Seed categories only once when server starts
    await seedCategories();

    // Start HTTP server
    server = app.listen(env.port, () => {
      console.log(`✅ Product server is listening on port ${env.port}`);
    });
  } catch (err) {
    console.error("😈 Product server error, shutting down ...", err);
    await gracefulShutdown();
  }
}

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

// Handle signals
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Handle unexpected errors
process.on("unhandledRejection", async (err) => {
  console.error("😈 Unhandled rejection:", err);
  await gracefulShutdown();
});

process.on("uncaughtException", async (err) => {
  console.error("😈 Uncaught exception:", err);
  await gracefulShutdown();
});

// Run main
main();
