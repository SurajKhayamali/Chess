import { User } from './user.interface';

export interface SignupDto extends Omit<User, 'id'> {}

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}
