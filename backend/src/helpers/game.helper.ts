import { Game } from '../entities/game.entity';
import { SocketEvent } from '../enums/socket.enum';

export function getGameStreamRoomName(slug: string) {
  return `${SocketEvent.GAME_STREAM}:${slug}`;
}

export const getIsPlayerPlaying = (game: Game, userId?: number) => {
  if (!userId) return false;
  return game.whitePlayer?.id === userId || game.blackPlayer?.id === userId;
};

export const getIsPlayerWhite = (game: Game, userId?: number) => {
  if (!userId) return undefined;

  if (game.whitePlayer?.id === userId) return true;
  if (game.blackPlayer?.id === userId) return false;

  return undefined;
};

export const getIsPlayerAllowedToMove = (
  isWhitesTurn: boolean,
  isPlayerWhite?: boolean
) => {
  if (isPlayerWhite === undefined) return false;
  return isWhitesTurn === isPlayerWhite;
};
