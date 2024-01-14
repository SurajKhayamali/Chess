import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../enums/socket.enum';
import { JoinGameQueueDto } from '../interfaces/game.interface';
import {
  getUserDataFromSocket,
  handleAfterValidation,
} from '../helpers/socket.helper';
import { joinGameQueueSchema } from '../schemas/game.schema';
import { handleJoinQueueByUser } from '../services/game.service';

export function registerGameHandlers(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.GAME_JOIN_QUEUE,
    handleAfterValidation<JoinGameQueueDto>(joinGameQueueSchema, (data) => {
      console.log(SocketEvent.GAME_JOIN_QUEUE, data);
      const userId = getUserDataFromSocket(socket)?.userId;

      return handleJoinQueueByUser(userId, data);
    })
  );
}
