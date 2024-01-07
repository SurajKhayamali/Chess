import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';
import { TypeORMError } from 'typeorm';

/**
 * Error handler middleware
 *
 * @param error
 * @param request
 * @param response
 * @param next
 */
export async function errorHandlerMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { statusCode, message, stack } = error;

  if (stack) {
    request.log.error(stack);
  }

  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof TypeORMError && error.name === 'QueryFailedError') {
    let message = 'Something went wrong!';
    let statusCode = 500;

    if (error.message.includes('duplicate key value violates unique')) {
      message = 'Duplicate key error!';
      statusCode = 400;
    }

    return response.status(statusCode).json({
      error: message,
    });
  }

  return response.status(statusCode || 500).json({
    error: message || 'Something went wrong!',
  });
}

export function notFoundHandlerMiddleware(_req: Request, res: Response) {
  return res.status(404).json({
    error: 'Not found!',
  });
}
