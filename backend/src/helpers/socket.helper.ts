import { SockerRoomPrefix } from '../enums/socket.enum';

export function getUserSocketRoom(userId: number) {
  return `${SockerRoomPrefix.USER}-${userId}`;
}
