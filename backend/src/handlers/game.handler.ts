import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../enums/socket.enum';
import {
  JoinGameQueueDto,
  LeaveGameQueueDto,
} from '../interfaces/game.interface';
import {
  getUserDataFromSocket,
  handleAfterValidation,
} from '../helpers/socket.helper';
import {
  joinGameQueueSchema,
  leaveGameQueueSchema,
} from '../schemas/game.schema';
import {
  handleJoinQueueByUser,
  handleLeaveQueueByUser,
} from '../services/game.service';

export function registerGameHandlers(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.GAME_JOIN_QUEUE,
    handleAfterValidation<JoinGameQueueDto>(joinGameQueueSchema, (data) => {
      console.log(SocketEvent.GAME_JOIN_QUEUE, data);
      const userId = getUserDataFromSocket(socket)?.userId;

      return handleJoinQueueByUser(userId, data);
    })
  );

  socket.on(
    SocketEvent.GAME_LEAVE_QUEUE,
    handleAfterValidation<LeaveGameQueueDto>(leaveGameQueueSchema, (data) => {
      console.log(SocketEvent.GAME_LEAVE_QUEUE, data);

      const userId = getUserDataFromSocket(socket)?.userId;
      return handleLeaveQueueByUser(userId, data);
    })
  );
}
