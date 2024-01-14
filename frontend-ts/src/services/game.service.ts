import { GAMES_ENDPOINTS } from 'constants/endpoint.constant';
import { getIsLoggedIn } from 'helpers/auth.helper';
import { fetchHelper } from 'helpers/fetch.helper';
import { Game } from 'interfaces/game.interface';

export async function getAllGames(): Promise<Game[]> {
  const games = await fetchHelper(GAMES_ENDPOINTS.GET_ALL);
  return games;
}

export async function getGameBySlug(slug: string): Promise<Game> {
  const isLoggedIn = getIsLoggedIn();
  if (!isLoggedIn) return getGameSpectateBySlug(slug);

  const game = await fetchHelper(GAMES_ENDPOINTS.GET_BY_SLUG(slug));
  return game;
}

export async function getGameSpectateBySlug(slug: string): Promise<Game> {
  const game = await fetchHelper(GAMES_ENDPOINTS.GET_SPECTATE_BY_SLUG(slug));
  return game;
}
