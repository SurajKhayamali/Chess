import { NotFoundException } from '../exceptions';
import { CreateUserDto, User } from '../interfaces/user.interface';
// import { UserModel } from '../model/user.model';

const users: User[] = [];

/**
 * Create a new user
 *
 * @param createUserDto
 *
 * @returns user
 */
export async function create(createUserDto: CreateUserDto) {
  // return UserModel.create(createUserDto);

  const user = {
    id: users.length + 1,
    ...createUserDto,
  };

  users.push(user);

  return user;
}

/**
 * Get all users
 *
 * @returns users
 */
export async function getAll() {
  // return UserModel.getAll();
  return users;
}

/**
 * Get user by id
 *
 * @param id
 *
 * @returns user
 */
export async function getById(id: number) {
  // return UserModel.getById(id);
  return users.find((user) => user.id === id);
}

/**
 * Get user by email
 *
 * @param email
 *
 * @returns user
 */
export async function getByEmail(email: string) {
  // return UserModel.getByEmail(email);
  return users.find((user) => user.email === email);
}

/**
 * Get user by username
 *
 * @param username
 *
 * @returns user
 */
export async function getByUsername(username: string) {
  // return UserModel.getByUsername(username);
  return users.find((user) => user.username === username);
}

/**
 * Get user by email or username
 *
 * @param emailOrUsername
 *
 * @returns user
 */
export async function getByEmailOrUsername(emailOrUsername: string) {
  // return UserModel.getByEmailOrUsername(emailOrUsername);
  return users.find(
    (user) =>
      user.email === emailOrUsername || user.username === emailOrUsername
  );
}

/**
 * Update user by id
 *
 * @param id
 * @param updateUserDto
 *
 * @returns user
 */
export async function update(id: number, updateUserDto: CreateUserDto) {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) throw new NotFoundException();

  users[userIndex] = {
    ...users[userIndex],
    ...updateUserDto,
  };

  return users;
}

/**
 * Delete user by id
 *
 * @param id
 */
export async function remove(id: number) {
  // return UserModel.remove(id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) throw new NotFoundException();

  users.splice(userIndex, 1);

  return users;
}
