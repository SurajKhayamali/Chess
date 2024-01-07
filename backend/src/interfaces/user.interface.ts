export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto extends Omit<User, 'id'> {}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
