import { GAMES_ENDPOINTS } from 'constants/endpoint.constant';
import { HttpMethods } from 'enums/http.enum';
import { SocketEvent } from 'enums/socket.enum';
import { getIsLoggedIn } from 'helpers/auth.helper';
import { fetchHelper } from 'helpers/fetch.helper';
import { getGameStreamRoomName } from 'helpers/game.helper';
import { emit } from 'helpers/socket.helper';
import { Game, RecordMoveDto } from 'interfaces/game.interface';
import { socket } from 'scripts/socket';

export async function getAllGames(): Promise<Game[]> {
  const games = await fetchHelper(GAMES_ENDPOINTS.GET_ALL);
  return games;
}

export async function getGameBySlug(slug: string): Promise<Game> {
  const isLoggedIn = getIsLoggedIn();
  if (!isLoggedIn) return getGameSpectateBySlug(slug);

  try {
    const game = await fetchHelper(GAMES_ENDPOINTS.GET_BY_SLUG(slug));
    return game;
  } catch (error) {
    return getGameSpectateBySlug(slug);
  }
}

export async function getGameSpectateBySlug(slug: string): Promise<Game> {
  const game = await fetchHelper(GAMES_ENDPOINTS.GET_SPECTATE_BY_SLUG(slug));
  return game;
}

export async function recordMove(
  id: number,
  recordMoveDto: RecordMoveDto
): Promise<Game> {
  const game = await fetchHelper(GAMES_ENDPOINTS.RECORD_MOVE(id), {
    method: HttpMethods.POST,
    body: JSON.stringify(recordMoveDto),
  });
  return game;
}

// Socket related
export async function joinGameStream(
  slug: string,
  handleMove: (recordMoveDto: RecordMoveDto) => void
): Promise<void> {
  emit(socket, SocketEvent.JOIN_GAME_STREAM, slug);

  socket.on(getGameStreamRoomName(slug), handleMove);
}
