import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import env from './app/env/index';

type ChatMessage = {
  id: string;
  roomId: string;
  senderId: string;
  senderRole: 'customer' | 'customerSupportManager' | string;
  message: string;
  createdAt: string;
};

type JoinRoomPayload = {
  roomId: string;
  userId: string;
  role: string;
};

type SendMessagePayload = {
  roomId: string;
  senderId: string;
  senderRole: string;
  message: string;
};

const roomMessages = new Map<string, ChatMessage[]>();

let httpServer: HttpServer;

async function main() {
  try {
    httpServer = createServer(app);

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.corsOrigin,
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      socket.on('join_room', (payload: JoinRoomPayload) => {
        if (!payload?.roomId) return;
        socket.join(payload.roomId);
        const history = roomMessages.get(payload.roomId) ?? [];
        socket.emit('room_history', history);
      });

      socket.on('chat_message', (payload: SendMessagePayload) => {
        if (!payload?.roomId || !payload?.senderId || !payload?.message?.trim()) return;
        const message: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          roomId: payload.roomId,
          senderId: payload.senderId,
          senderRole: payload.senderRole || 'customer',
          message: payload.message.trim(),
          createdAt: new Date().toISOString(),
        };

        const next = [...(roomMessages.get(payload.roomId) ?? []), message];
        roomMessages.set(payload.roomId, next);
        io.to(payload.roomId).emit('chat_message', message);
      });
    });

    httpServer.listen(env.port, () => {
      console.log(`✅ Chat server is listening on port ${env.port}`);
    });
  } catch (err) {
    console.log('😈 Chat server error, shutting down ...', err);
  }
}

main();

const gracefulShutdown = async () => {
  console.log('⚠️ Shutting down gracefully...');
  if (httpServer) {
    httpServer.close(() => {
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
