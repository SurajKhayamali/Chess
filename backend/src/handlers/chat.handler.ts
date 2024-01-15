import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../enums/socket.enum';
import {
  getUserDataFromSocket,
  handleAfterValidation,
  respondUnauthorized,
} from '../helpers/socket.helper';
import { createChatByUserSchema } from '../schemas/chat.schema';
import { createByUser } from '../services/chat.service';

export function registerChatHandlers(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.PUBLIC_MESSAGE,
    handleAfterValidation(createChatByUserSchema, async (data) => {
      console.log(SocketEvent.PUBLIC_MESSAGE, data);
      const userId = getUserDataFromSocket(socket)?.userId;
      if (!userId) return respondUnauthorized();

      const chat = await createByUser(userId, data);

      socket.broadcast.emit(SocketEvent.PUBLIC_MESSAGE, chat);

      return chat;
    })
  );
}
