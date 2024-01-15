import { SocketEvent } from '../enums/socket.enum';

export function getGameStreamRoomName(slug: string) {
  return `${SocketEvent.GAME_STREAM}:${slug}`;
}
