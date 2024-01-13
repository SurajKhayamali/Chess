import { NextFunction, Request, Response } from 'express';

import * as chatService from '../services/chat.service';
import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { AuthenticatedRequest } from '../interfaces/jwt.interface';
import { NotFoundException } from '../exceptions';
import {
  CreateChatDto,
  CreateChatByUserDto,
} from '../interfaces/chat.interface';
import { ChatAdapter } from '../adapters/chat.adapter';

/**
 * Create chat
 *
 * @param req
 * @param res
 */
export async function create(req: Request, res: Response) {
  const createGameDto = req.body as CreateChatDto;

  const chat = await chatService.create(createGameDto);

  res.status(HttpStatusCode.CREATED).json(chat);
}

/**
 * Create chat by user
 *
 * @param req
 * @param res
 */
export async function createByUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new NotFoundException('User not found');

  const { userId } = req.user;
  const createChatByUserDto = req.body as CreateChatByUserDto;

  const chat = await chatService.createByUser(userId, createChatByUserDto);
  const adaptedChat = ChatAdapter.adaptForResponse(chat);

  res.status(HttpStatusCode.CREATED).json(adaptedChat);
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
 * Get all chats by user id
 *
 * @param req
 * @param res
 */
export async function getAllByUserId(req: AuthenticatedRequest, res: Response) {
  if (!req.user) throw new NotFoundException('User not found');

  const { userId } = req.user;

  const chats = await chatService.getAllByUserId(userId);
  const adaptedChats = ChatAdapter.adaptAllForResponse(chats);

  res.json(adaptedChats);
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
 * Get chat by id by user id
 *
 * @param req
 * @param res
 * @param next
 */
export async function getByIdByUserId(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new NotFoundException('User not found');

  const { userId } = req.user;
  const { id } = req.params;

  try {
    const chat = await chatService.getByIdOrFail(parseInt(id), userId);
    const adaptedChat = ChatAdapter.adaptForResponse(chat);

    res.json(adaptedChat);
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
 * Update chat by user
 *
 * @param req
 * @param res
 * @param next
 */
export async function updateByUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new NotFoundException('User not found');

  const { userId } = req.user;
  const { id } = req.params;
  const updateChatByUserDto = req.body;

  try {
    const chat = await chatService.update(
      parseInt(id),
      updateChatByUserDto,
      userId
    );
    const adaptedChat = ChatAdapter.adaptForResponse(chat);

    res.json(adaptedChat);
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

/**
 * Delete chat by user
 *
 * @param req
 * @param res
 * @param next
 */
export async function removeByUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw new NotFoundException('User not found');

  const { userId } = req.user;
  const { id } = req.params;

  try {
    const chat = await chatService.remove(parseInt(id), userId);
    const adaptedChat = ChatAdapter.adaptForResponse(chat);

    res.json(adaptedChat);
  } catch (error) {
    next(error);
  }
}
