import { NotFoundException } from '../exceptions';
import { CreateChatDto, UpdateChatDto } from '../interfaces/chat.interface';
import { ChatRepository } from '../repositories/chat.repository';

export async function create(createChatDto: CreateChatDto) {
  const chat = ChatRepository.create(createChatDto);
  await ChatRepository.save(chat);
  return chat;
}

export async function getAll() {
  const chats = await ChatRepository.find();
  return chats;
}

export async function getById(id: number) {
  return ChatRepository.findOneBy({ id });
}

export async function getByIdOrFail(id: number) {
  const chat = await getById(id);

  if (!chat) {
    throw new NotFoundException('Chat not found');
  }

  return chat;
}

export async function update(id: number, updateChatDto: UpdateChatDto) {
  const chat = await getByIdOrFail(id);

  ChatRepository.merge(chat, updateChatDto);

  await ChatRepository.save(chat);

  return chat;
}

export async function remove(id: number) {
  const chat = await getByIdOrFail(id);

  await ChatRepository.remove(chat);
}
