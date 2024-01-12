import { User } from '../entities/user.entity';
import { BaseColumnsToOmit } from './base.interface';

export interface CreateUserDto extends Omit<User, BaseColumnsToOmit> {}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UserResponse extends Omit<User, 'password'> {
  fullName: string;
}
