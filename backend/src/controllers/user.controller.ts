import { NextFunction, Request, Response } from 'express';

import * as userService from '../services/user.service';
import { UserAdapter } from '../adapters/user.adapter';
import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { AuthenticatedRequest } from '../interfaces/jwt.interface';
import { NotFoundException } from '../exceptions';

/**
 * Create user
 *
 * @param req
 * @param res
 */
export async function create(req: Request, res: Response) {
  const createUserDto = req.body;

  const user = await userService.create(createUserDto);
  const adaptedUser = UserAdapter.adaptForResponse(user);

  res.status(HttpStatusCode.CREATED).json(adaptedUser);
}

/**
 * Get all users
 *
 * @param req
 * @param res
 */
export async function getAll(_req: Request, res: Response) {
  const users = await userService.getAll();
  const adaptedUsers = UserAdapter.adaptAllForResponse(users);

  res.json(adaptedUsers);
}

/**
 * Get user by id
 *
 * @param req
 * @param res
 * @param next
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const user = await userService.getByIdOrFail(parseInt(id));
    const adaptedUser = UserAdapter.adaptForResponse(user);

    res.json(adaptedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * Get logged in user profile
 *
 * @param req
 * @param res
 * @param next
 */
export async function getLoggedInUserProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.userId;

  if (!userId) throw new NotFoundException('User not found');

  try {
    const user = await userService.getByIdOrFail(userId);
    const adaptedUser = UserAdapter.adaptForResponse(user);

    return res.json(adaptedUser);
  } catch (error) {
    return next(error);
  }
}

/**
 * Update user
 *
 * @param req
 * @param res
 * @param next
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateUserDto = req.body;

  try {
    const user = await userService.update(parseInt(id), updateUserDto);
    const adaptedUser = UserAdapter.adaptForResponse(user);

    res.json(adaptedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * Update logged in user profile
 *
 * @param req
 * @param res
 * @param next
 */
export async function updateLoggedInUserProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.userId;
  const updateUserDto = req.body;

  if (!userId) throw new NotFoundException('User not found');

  try {
    const user = await userService.update(userId, updateUserDto);
    const adaptedUser = UserAdapter.adaptForResponse(user);

    res.json(adaptedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete user
 *
 * @param req
 * @param res
 * @param next
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const user = await userService.remove(parseInt(id));
    const adaptedUser = UserAdapter.adaptForResponse(user);

    res.json(adaptedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all online users
 *
 * @param req
 * @param res
 */
export async function getOnlineUsers(_req: Request, res: Response) {
  const onlineUsers = await userService.getOnlineUsers();

  res.json(onlineUsers);
}

/**
 * Message user
 *
 * @param req
 * @param res
 */
export async function messageUser(req: Request, res: Response) {
  const { id } = req.params;
  const { message } = req.body;

  const user = await userService.messageUser(parseInt(id), message);

  res.json(user);
}
