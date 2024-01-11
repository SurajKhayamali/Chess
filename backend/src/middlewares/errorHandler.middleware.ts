import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';
import { TypeORMError } from 'typeorm';
import { HttpStatusCode } from '../enums/httpStatusCode.enum';

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
    let statusCode = HttpStatusCode.INTERNAL_SERVER;

    if (error.message.includes('duplicate key value violates unique')) {
      message = 'Duplicate key error!';
      statusCode = HttpStatusCode.BAD_REQUEST;
    }

    return response.status(statusCode).json({
      error: message,
    });
  }

  return response.status(statusCode || HttpStatusCode.INTERNAL_SERVER).json({
    error: message || 'Something went wrong!',
  });
}

export function notFoundHandlerMiddleware(_req: Request, res: Response) {
  return res.status(HttpStatusCode.NOT_FOUND).json({
    error: 'Not found!',
  });
}
