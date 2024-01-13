import { User } from '../entities/user.entity';
import { BaseColumnsToOmit } from './base.interface';

export interface CreateUserDto extends Omit<User, BaseColumnsToOmit> {}

export interface UpdateUserDto
  extends Partial<Omit<CreateUserDto, 'password'>> {}

export interface UserResponse extends Omit<User, 'password'> {
  fullName: string;
}
