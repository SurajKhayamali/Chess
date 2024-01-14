import { Server as HTTPServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-streams-adapter';

import serverConfig from './config';
import { initializeRedis, redisClient } from './redis.init';
import { registerUserHandlers } from './handlers/user.handler';
import { extractJWTTokenFromHeaders, verifyJWT } from './helpers/jwt.helper';
import { getUserSocketRoom } from './helpers/socket.helper';
import { instrument } from '@socket.io/admin-ui';
import { registerChatHandlers } from './handlers/chat.handler';
import { registerGameHandlers } from './handlers/game.handler';

let io: Server;

const onConnection = (socket: Socket) => {
  // const token = extractJWTTokenFromRequest(socket.handshake)
  const token = extractJWTTokenFromHeaders(socket.handshake.headers);
  if (token) {
    try {
      const payload = verifyJWT(token);
      if (!payload) return;

      if (payload.tokenType !== 'access') return;

      const { userId } = payload;

      // console.log('a user connected', userId, getUserSocketRoom(userId));
      socket.join(getUserSocketRoom(userId));
    } catch (error) {
      console.log(error);
    }
  }
  // registerOrderHandlers(io, socket);
  registerUserHandlers(io, socket);
  registerChatHandlers(io, socket);
  registerGameHandlers(io, socket);
};

export const initializeSocket = async (httpServer: HTTPServer) => {
  await initializeRedis();

  io = new Server(httpServer, {
    serveClient: false,
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
    cors: {
      origin: [serverConfig.clientUrl, 'https://admin.socket.io'],
      credentials: true,
    },
    adapter: createAdapter(redisClient),
  });

  !serverConfig.isProduction &&
    instrument(io, {
      auth: false,
      mode: 'development',
    });

  io.on('connection', onConnection);

  // io.on('connection', (socket) => {
  //   // ...
  //   // console.log('a user connected', socket);
  //   console.log('a user connected');

  //   if (socket.recovered) {
  //     // recovery was successful: socket.id, socket.rooms and socket.data were restored
  //   } else {
  //     // new or unrecoverable session
  //   }
  // });

  // io.of('/').adapter.on('create-room', (room) => {
  //   console.log(`room ${room} was created`);
  // });

  // io.of('/').adapter.on('join-room', (room, id) => {
  //   console.log(`socket ${id} has joined room ${room}`);
  // });
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }

  return io;
};
