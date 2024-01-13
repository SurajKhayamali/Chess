import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../enums/socket.enum';
import { handleWithAck } from '../helpers/socket.helper';

export function registerChatHandlers(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.PUBLIC_MESSAGE,
    handleWithAck(async (data) => {
      console.log(SocketEvent.PUBLIC_MESSAGE, data);
      // socket.emit(SocketEvent.USER_MESSAGE, 'user-message');
      socket.broadcast.emit(SocketEvent.PUBLIC_MESSAGE, data);
    })
  );
}
