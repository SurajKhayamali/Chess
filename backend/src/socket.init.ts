import { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-streams-adapter';

import serverConfig from './config';
import { initializeRedis, redisClient } from './redis.init';

export const initializeSocket = async (httpServer: HTTPServer) => {
  await initializeRedis();

  const io = new Server(httpServer, {
    serveClient: false,
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
    cors: {
      origin: serverConfig.clientUrl,
      credentials: true,
    },
    adapter: createAdapter(redisClient),
  });

  io.on('connection', (socket) => {
    // ...
    // console.log('a user connected', socket);
    console.log('a user connected');

    if (socket.recovered) {
      // recovery was successful: socket.id, socket.rooms and socket.data were restored
    } else {
      // new or unrecoverable session
    }
  });
};
