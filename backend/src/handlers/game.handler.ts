import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../enums/socket.enum';
import { JoinGameQueueDto } from '../interfaces/game.interface';
import { handleAfterValidation } from '../helpers/socket.helper';
import { joinGameQueueSchema } from '../schemas/game.schema';

export function registerGameHandlers(_io: Server, socket: Socket) {
  socket.on(
    SocketEvent.GAME_JOIN_QUEUE,
    handleAfterValidation<JoinGameQueueDto>(joinGameQueueSchema, (data) => {
      console.log(SocketEvent.GAME_JOIN_QUEUE, data);
      if (data.timeLimit > 80) {
        // Custom validation example
        throw new Error('Time limit must be less than 10');
      }
    })
  );
}
