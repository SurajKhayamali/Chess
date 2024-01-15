import { Request, Response } from 'express';
import { getBySlugOrFail } from '../services/game.service';

/**
 * Get game by slug
 *
 * @param req
 * @param res
 * @param next
 * @returns
 * @throws NotFoundException
 */
export async function getBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  const game = await getBySlugOrFail(slug);

  res.json(game);
}
