import { NextFunction, Request, Response } from 'express';

import * as moveService from '../services/move.service';
import { HttpStatusCode } from '../enums/httpStatusCode.enum';

/**
 * Create move
 *
 * @param req
 * @param res
 */
export async function create(req: Request, res: Response) {
  const createGameDto = req.body;

  const move = await moveService.create(createGameDto);

  res.status(HttpStatusCode.CREATED).json(move);
}

/**
 * Get all moves
 *
 * @param req
 * @param res
 */
export async function getAll(_req: Request, res: Response) {
  const moves = await moveService.getAll();

  res.json(moves);
}

/**
 * Get move by id
 *
 * @param req
 * @param res
 * @param next
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const move = await moveService.getByIdOrFail(parseInt(id));

    res.json(move);
  } catch (error) {
    next(error);
  }
}

/**
 * Update move
 *
 * @param req
 * @param res
 * @param next
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateGameDto = req.body;

  try {
    const move = await moveService.update(parseInt(id), updateGameDto);

    res.json(move);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete move
 *
 * @param req
 * @param res
 * @param next
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const move = await moveService.remove(parseInt(id));

    res.json(move);
  } catch (error) {
    next(error);
  }
}
