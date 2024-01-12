import { NotFoundException } from '../exceptions';
import { CreateChatDto, UpdateChatDto } from '../interfaces/chat.interface';
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
 * Get all chats
 *
 * @returns chats
 */
export async function getAll() {
  const chats = await ChatRepository.find();
  return chats;
}

/**
 * Get chat by id
 *
 * @param id
 *
 * @returns chat
 */
export async function getById(id: number) {
  return ChatRepository.findOneBy({ id });
}

/**
 * Get chat by id or fail
 *
 * @param id
 *
 * @returns chat
 */
export async function getByIdOrFail(id: number) {
  const chat = await getById(id);

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
export async function update(id: number, updateChatDto: UpdateChatDto) {
  const chat = await getByIdOrFail(id);

  ChatRepository.merge(chat, updateChatDto);

  await ChatRepository.save(chat);

  return chat;
}

/**
 * Delete chat by id
 *
 * @param id
 */
export async function remove(id: number) {
  const chat = await getByIdOrFail(id);

  await ChatRepository.remove(chat);

  return chat;
}
