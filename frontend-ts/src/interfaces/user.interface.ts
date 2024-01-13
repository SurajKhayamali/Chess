export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  username: string;
}

export interface UpdateUserDto extends Partial<Omit<User, 'id'>> {}

export interface UpdateUserPasswordDto {
  oldPassword: string;
  newPassword: string;
}
