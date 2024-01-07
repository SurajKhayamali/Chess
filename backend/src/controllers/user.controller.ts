import { NextFunction, Request, Response } from 'express';

import * as userService from '../services/user.service';

/**
 * Create user
 *
 * @param req
 * @param res
 */
export async function create(req: Request, res: Response) {
  const createUserDto = req.body;

  const user = await userService.create(createUserDto);

  res.status(201).json(user);
}

/**
 * Get all users
 *
 * @param req
 * @param res
 */
export async function getAll(_req: Request, res: Response) {
  const users = await userService.getAll();

  res.json(users);
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
    const user = await userService.getById(parseInt(id));

    res.json(user);
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

    res.json(user);
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

    res.json(user);
  } catch (error) {
    next(error);
  }
}
