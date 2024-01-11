import { Socket } from 'socket.io-client';

export function emit(socket: Socket, event: string, arg: unknown[]) {
  socket.timeout(5000).emit(event, arg, (err: Error) => {
    if (err) {
      // no ack from the server, let's retry
      emit(socket, event, arg);
    }
  });
}
