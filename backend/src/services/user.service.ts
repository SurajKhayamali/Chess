import { CreateUserDto } from '../interfaces/user.interface';
import { UserRepository } from '../repositories/user.repository';

/**
 * Create a new user
 *
 * @param createUserDto
 *
 * @returns user
 */
export async function create(createUserDto: CreateUserDto) {
  const user = UserRepository.create(createUserDto);
  await UserRepository.save(user);
  return user;
}

/**
 * Get all users
 *
 * @returns users
 */
export async function getAll() {
  const users = await UserRepository.find();
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
  return UserRepository.findOneBy({ id });
}

/**
 * Get user by id or fail
 *
 * @param id
 *
 * @returns user
 */
export async function getByIdOrFail(id: number) {
  const user = await getById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/**
 * Get user by email
 *
 * @param email
 *
 * @returns user
 */
export async function getByEmail(email: string) {
  return UserRepository.findOneBy({ email });
}

/**
 * Get user by username
 *
 * @param username
 *
 * @returns user
 */
export async function getByUsername(username: string) {
  return UserRepository.findOneBy({ username });
}

/**
 * Get user by email or username
 *
 * @param emailOrUsername
 *
 * @returns user
 */
export async function getByEmailOrUsername(emailOrUsername: string) {
  return UserRepository.findOneBy([
    { email: emailOrUsername },
    { username: emailOrUsername },
  ]);
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
  const user = await getByIdOrFail(id);

  UserRepository.merge(user, updateUserDto);

  await UserRepository.save(user);

  return user;
}

/**
 * Delete user by id
 *
 * @param id
 */
export async function remove(id: number) {
  const user = await getByIdOrFail(id);

  await UserRepository.remove(user);

  return user;
}
