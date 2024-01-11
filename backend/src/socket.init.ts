import { Server as HTTPServer } from 'node:http';
import { Server } from 'socket.io';
import serverConfig from './config';

export const initializeSocket = (httpServer: HTTPServer) => {
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
  });

  io.on('connection', (socket) => {
    // ...
    console.log('a user connected', socket);

    if (socket.recovered) {
      // recovery was successful: socket.id, socket.rooms and socket.data were restored
    } else {
      // new or unrecoverable session
    }
  });
};
