import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../enums/socket.enum';
import { addOnlineUser } from '../services/user.service';
import { UserOnlineDto } from '../interfaces/auth.interface';

export function registerUserHandlers(_io: Server, socket: Socket) {
  socket.on(SocketEvent.USER_ONLINE, async (data: UserOnlineDto, callback) => {
    console.log(SocketEvent.USER_ONLINE, data);
    // socket.emit(SocketEvent.USER_ONLINE, 'user-online');
    await addOnlineUser(data.userId);
    callback({ status: 'ok' });
  });
}
