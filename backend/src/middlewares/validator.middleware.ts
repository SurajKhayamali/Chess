import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

import { BadRequestException } from '../exceptions';
import { validateSchema } from '../helpers/joi.helper';

export function validateReqQuery(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = validateSchema(schema, req.query);
    } catch (error) {
      return next(new BadRequestException((error as Error).message));
    } finally {
      next();
    }
  };
}

export function validateReqBody(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = validateSchema(schema, req.body);
    } catch (error) {
      return next(new BadRequestException((error as Error).message));
    } finally {
      next();
    }
  };
}
