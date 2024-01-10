import { User } from './user.interface';

export interface JwtDecodedPayload
  extends Pick<
    User,
    'firstName' | 'middleName' | 'lastName' | 'email' | 'username'
  > {
  userId: number;
}
