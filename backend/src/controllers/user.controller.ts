import { NextFunction, Request, Response } from 'express';

import * as userService from '../services/user.service';
import { UserAdapter } from '../adapters/user.adapter';

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

  res.status(201).json(adaptedUser);
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
