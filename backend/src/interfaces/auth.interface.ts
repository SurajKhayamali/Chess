import { CreateUserDto } from './user.interface';

export interface SignupDto extends CreateUserDto {}

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}
