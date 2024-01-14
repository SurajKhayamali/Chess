import { GAMES_ENDPOINTS } from 'constants/endpoint.constant';
import { fetchHelper } from 'helpers/fetch.helper';

export async function getGameBySlug(slug: string) {
  const game = await fetchHelper(GAMES_ENDPOINTS.GET_BY_SLUG(slug));
  return game;
}
