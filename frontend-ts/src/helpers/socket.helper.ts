import { Socket } from 'socket.io-client';

/**
 * Emit an event to the server and retry if no ack is received
 *
 * @param socket
 * @param event
 * @param arg
 */
export function emit(socket: Socket, event: string, arg: unknown) {
  return new Promise((resolve, reject) => {
    socket.timeout(5000).emit(event, arg, async (err: Error, res: unknown) => {
      // console.log('ack', err, res);
      if (err) {
        // no ack from the server, let's retry
        resolve(await emit(socket, event, arg));
      }

      if ((res as { error: unknown })?.error) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });
}
