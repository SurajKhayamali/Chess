import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

import { BadRequestException } from '../exceptions';

export function validateReqQuery(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return next(new BadRequestException(error.message));
    }

    req.query = value;

    next();
  };
}

export function validateReqBody(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return next(new BadRequestException(error.message));
    }

    req.body = value;

    next();
  };
}
