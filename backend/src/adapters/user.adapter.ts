import { User } from '../entities/user.entity';
import { UserResponse } from '../interfaces/user.interface';

export class UserAdapter {
  static adaptForResponse(user: User): UserResponse {
    const rest = { ...user, password: undefined };
    const { firstName, middleName, lastName } = rest;
    const fullName = middleName
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`;

    return {
      ...rest,
      fullName,
    };
  }

  static adaptAllForResponse(users: User[]): UserResponse[] {
    return users.map((user) => this.adaptForResponse(user));
  }
}
