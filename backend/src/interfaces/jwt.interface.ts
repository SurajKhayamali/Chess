import { Request } from 'express';
import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { User } from '../entities/user.entity';

export interface JwtPayload
  extends BaseJwtPayload,
    Pick<User, 'firstName' | 'middleName' | 'lastName' | 'email' | 'username'> {
  userId: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
