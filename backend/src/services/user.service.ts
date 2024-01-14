import { RedisKeys } from '../enums/redis.enum';
import { SocketEvent } from '../enums/socket.enum';
import { NotFoundException } from '../exceptions';
import { getUserSocketRoom } from '../helpers/socket.helper';
import { CreateUserDto, UpdateUserDto } from '../interfaces/user.interface';
import { redisClient } from '../redis.init';
import { UserRepository } from '../repositories/user.repository';
import { getSocketIO } from '../socket.init';

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
    throw new NotFoundException('User not found');
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
export async function update(id: number, updateUserDto: UpdateUserDto) {
  const user = await getByIdOrFail(id);

  UserRepository.merge(user, updateUserDto);

  await UserRepository.save(user);

  return user;
}

/**
 * Update user password by id
 *
 * @param id
 * @param password
 */
export async function changePassword(id: number, password: string) {
  const user = await getByIdOrFail(id);

  user.password = password;

  await UserRepository.save(user);
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

// Redis related functions
export async function getOnlineUsers() {
  const users = await redisClient.SMEMBERS(RedisKeys.USERS_ONLINE);
  return users.map((user) => Number(user));
}

export async function addOnlineUser(userId: number) {
  await redisClient.SADD(RedisKeys.USERS_ONLINE, String(userId));
}

export async function removeOnlineUser(userId: number) {
  await redisClient.SREM(RedisKeys.USERS_ONLINE, String(userId));
}

export async function messageUser(userId: number, message: string) {
  // await redisClient.PUBLISH(RedisKeys.USER_MESSAGE(userId), message);

  const io = getSocketIO();
  // console.log('sending message to user', userId, getUserSocketRoom(userId));
  io.to(getUserSocketRoom(userId)).emit(SocketEvent.USER_MESSAGE, message);

  return {
    message: 'Message sent',
  };
}
