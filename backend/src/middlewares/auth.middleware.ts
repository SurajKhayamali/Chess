import { Response, NextFunction } from 'express';

import { extractJWTTokenFromRequest, verifyJWT } from '../helpers/jwt.helper';
import { UnauthorizedException } from '../exceptions';
import { AuthenticatedRequest } from '../interfaces/jwt.interface';

export function auth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const token = extractJWTTokenFromRequest(req);

  if (!token) return next(new UnauthorizedException('Token not found'));

  try {
    const payload = verifyJWT(token);
    if (!payload) return next(new UnauthorizedException('Invalid token'));

    if (payload.tokenType !== 'access')
      return next(new UnauthorizedException('Invalid token type'));

    delete payload.tokenType;

    req.user = payload;

    next();
  } catch (error) {
    next(new UnauthorizedException((error as Error).message));
  }
}
