import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';

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

  return response.status(statusCode || 500).json({
    error: message || 'Something went wrong!',
  });
}

export function notFoundHandlerMiddleware(_req: Request, res: Response) {
  return res.status(404).json({
    error: 'Not found!',
  });
}
