import { NextFunction, Request, Response } from 'express';

import * as chatService from '../services/chat.service';
import { HttpStatusCode } from '../enums/httpStatusCode.enum';

/**
 * Create chat
 *
 * @param req
 * @param res
 */
export async function create(req: Request, res: Response) {
  const createGameDto = req.body;

  const chat = await chatService.create(createGameDto);

  res.status(HttpStatusCode.CREATED).json(chat);
}

/**
 * Get all chats
 *
 * @param req
 * @param res
 */
export async function getAll(_req: Request, res: Response) {
  const chats = await chatService.getAll();

  res.json(chats);
}

/**
 * Get chat by id
 *
 * @param req
 * @param res
 * @param next
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const chat = await chatService.getByIdOrFail(parseInt(id));

    res.json(chat);
  } catch (error) {
    next(error);
  }
}

/**
 * Update chat
 *
 * @param req
 * @param res
 * @param next
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateGameDto = req.body;

  try {
    const chat = await chatService.update(parseInt(id), updateGameDto);

    res.json(chat);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete chat
 *
 * @param req
 * @param res
 * @param next
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const chat = await chatService.remove(parseInt(id));

    res.json(chat);
  } catch (error) {
    next(error);
  }
}
