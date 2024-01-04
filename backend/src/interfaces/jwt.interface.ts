import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export interface JwtPayload extends BaseJwtPayload {
  userId: number;
}
