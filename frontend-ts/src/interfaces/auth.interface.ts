import { User } from './user.interface';

export interface SignupDto extends Omit<User, 'id'> {}

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordFormValues extends ChangePasswordDto {
  confirmPassword: string;
}

export interface UserOnlineDto {
  userId: number;
}
