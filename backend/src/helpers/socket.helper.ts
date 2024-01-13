import { SockerRoomPrefix } from '../enums/socket.enum';

export function getUserSocketRoom(userId: number) {
  return `${SockerRoomPrefix.USER}-${userId}`;
}

export function handleWithAck(
  callback: (data: unknown) => void,
  customAckRes?: unknown
) {
  return (data: unknown, ack: (response: unknown) => void) => {
    callback(data);
    console.log(ack, customAckRes);
    ack && ack(customAckRes || { status: 'ok' });
  };
}
