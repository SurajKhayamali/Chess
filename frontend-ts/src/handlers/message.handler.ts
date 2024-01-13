import { SocketEvent } from 'enums/socket.enum';
import { Socket } from 'socket.io-client';

export function registerMessageHandlers(socket: Socket) {
  socket.on(SocketEvent.USER_MESSAGE, (message: unknown) => {
    console.log('Message received:', message);
  });
}
