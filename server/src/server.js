import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server as SocketServer } from 'socket.io';
import { SERVER_HEALTH } from '../../shared/constants.js';

export function createServerApp(options = {}) {
  const clientOrigin = options.clientOrigin || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketServer(httpServer, {
    cors: {
      origin: clientOrigin,
      methods: ['GET', 'POST']
    }
  });

  app.use(cors({ origin: clientOrigin }));
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json(SERVER_HEALTH);
  });

  io.on('connection', (socket) => {
    socket.emit('server:hello', {
      service: SERVER_HEALTH.service,
      message: 'Arc-12 telemetry relay online.'
    });
  });

  return { app, httpServer, io };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const port = Number(process.env.PORT || 3000);
  const { httpServer } = createServerApp();
  httpServer.listen(port, () => {
    console.log(`Iron Requiem remaster server listening on ${port}`);
  });
}
