import { GAMES_ENDPOINTS } from 'constants/endpoint.constant';
import { fetchHelper } from 'helpers/fetch.helper';
import { Game } from 'interfaces/game.interface';

export async function getAllGames(): Promise<Game[]> {
  const games = await fetchHelper(GAMES_ENDPOINTS.GET_ALL);
  return games;
}

export async function getGameBySlug(slug: string): Promise<Game> {
  const game = await fetchHelper(GAMES_ENDPOINTS.GET_BY_SLUG(slug));
  return game;
}
