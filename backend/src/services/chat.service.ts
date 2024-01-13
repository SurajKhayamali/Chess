import { User } from '../entities/user.entity';
import { NotFoundException } from '../exceptions';
import {
  CreateChatByUserDto,
  CreateChatDto,
  UpdateChatDto,
} from '../interfaces/chat.interface';
import { ChatRepository } from '../repositories/chat.repository';

/**
 * Create a new chat
 *
 * @param createChatDto
 *
 * @returns chat
 */
export async function create(createChatDto: CreateChatDto) {
  const chat = ChatRepository.create(createChatDto);
  await ChatRepository.save(chat);
  return chat;
}

/**
 * Create a new chat by user
 *
 * @param createChatByUserDto
 *
 * @returns chat
 */
export async function createByUser(
  userId: number,
  createByUserChatDto: CreateChatByUserDto
) {
  const chat = ChatRepository.create({
    ...createByUserChatDto,
    sender: userId as unknown as User,
  });
  await ChatRepository.save(chat);

  return getByIdOrFail(chat.id, userId);
}

/**
 * Get all chats
 *
 * @returns chats
 */
export async function getAll() {
  const chats = await ChatRepository.find();
  return chats;
}

/**
 * Get all chats by user id
 *
 * @param userId
 *
 * @returns chats
 */
export async function getAllByUserId(userId: number) {
  const chats = await ChatRepository.createQueryBuilder('chat')
    .where('chat.sender_id = :userId', { userId })
    .orWhere('chat.receiver_id = :userId', { userId })
    .leftJoinAndSelect('chat.sender', 'sender')
    .leftJoinAndSelect('chat.receiver', 'receiver')
    .getMany();
  return chats;
}

/**
 * Get chat by id
 *
 * @param id
 * @param userId
 *
 * @returns chat
 */
export async function getById(id: number, userId?: number) {
  if (!userId) return ChatRepository.findOneBy({ id });

  return ChatRepository.createQueryBuilder('chat')
    .where('chat.id = :id', { id })
    .andWhere('chat.sender_id = :userId', { userId })
    .orWhere('chat.receiver_id = :userId', { userId })
    .leftJoinAndSelect('chat.sender', 'sender')
    .leftJoinAndSelect('chat.receiver', 'receiver')
    .getOne();
}

/**
 * Get chat by id or fail
 *
 * @param id
 * @param userId
 *
 * @returns chat
 */
export async function getByIdOrFail(id: number, userId?: number) {
  const chat = await getById(id, userId);

  if (!chat) {
    throw new NotFoundException('Chat not found');
  }

  return chat;
}

/**
 * Update chat by id
 *
 * @param id
 * @param updateChatDto
 *
 * @returns chat
 */
export async function update(
  id: number,
  updateChatDto: UpdateChatDto,
  userId?: number
) {
  const chat = await getByIdOrFail(id, userId);

  ChatRepository.merge(chat, updateChatDto);

  await ChatRepository.save(chat);

  return chat;
}

/**
 * Delete chat by id
 *
 * @param id
 */
export async function remove(id: number, userId?: number) {
  const chat = await getByIdOrFail(id, userId);

  await ChatRepository.remove(chat);

  return chat;
}
