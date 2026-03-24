import { Server } from 'http';
import app from './app';
import env from './app/env';

let server: Server;

async function main() {
  try {
    server = app.listen(env.port, () => {
      console.log(`✅ Delivery server is listening on port ${env.port}`);
    });
  } catch (err) {
    console.log('😈 Delivery server error, shutting down ...', err);
  }
}

main();

const gracefulShutdown = async () => {
  console.log('⚠️ Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('❌ HTTP server closed');
    });
  }
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', async (err) => {
  console.log('😈 Unhandled rejection:', err);
  await gracefulShutdown();
});

process.on('uncaughtException', async (err) => {
  console.log('😈 Uncaught exception:', err);
  await gracefulShutdown();
});
