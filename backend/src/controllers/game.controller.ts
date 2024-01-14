import { NextFunction, Request, Response } from 'express';

import * as gameService from '../services/game.service';
import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { QueryGameDto } from '../interfaces/game.interface';
import { AuthenticatedRequest } from '../interfaces/jwt.interface';
import { NotFoundException } from '../exceptions';

/**
 * Create game
 *
 * @param req
 * @param res
 */
export async function create(req: Request, res: Response) {
  const createGameDto = req.body;

  const game = await gameService.create(createGameDto);

  res.status(HttpStatusCode.CREATED).json(game);
}

/**
 * Get all filtered games
 *
 * @param req
 * @param res
 */
export async function getAll(req: Request, res: Response) {
  const games = await gameService.getAllFiltered(req.query as QueryGameDto);

  res.json(games);
}

/**
 * Get all filtered games by user
 *
 * @param req
 * @param res
 */
export async function getAllFilteredByUser(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.user?.userId;
  if (!userId) throw new NotFoundException('User not found');

  const games = await gameService.getAllFilteredByUser(
    userId,
    req.query as QueryGameDto
  );

  res.json(games);
}

/**
 * Get game by id
 *
 * @param req
 * @param res
 * @param next
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const game = await gameService.getByIdOrFail(parseInt(id));

    res.json(game);
  } catch (error) {
    next(error);
  }
}

/**
 * Update game
 *
 * @param req
 * @param res
 * @param next
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateGameDto = req.body;

  try {
    const game = await gameService.update(parseInt(id), updateGameDto);

    res.json(game);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete game
 *
 * @param req
 * @param res
 * @param next
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const game = await gameService.remove(parseInt(id));

    res.json(game);
  } catch (error) {
    next(error);
  }
}
