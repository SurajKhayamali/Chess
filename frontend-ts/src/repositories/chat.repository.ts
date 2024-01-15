import { Chat } from 'entities/Chat';
import { getIsLoggedIn } from 'helpers/auth.helper';
import {
  CreateChatDto,
  QueryChatDto,
  UpdateChatDto,
} from 'interfaces/chat.interface';
import { createChat, getChats, updateChat } from 'services/chat.service';

class ChatRepository {
  chats: Chat[] = [];

  constructor(channel?: string) {
    this.getChats({ channel });
  }

  async getChats(queryChatDto?: QueryChatDto): Promise<Chat[]> {
    const isLoggedIn = getIsLoggedIn();
    if (!isLoggedIn) {
      return [];
    }

    const chats = await getChats(queryChatDto);
    this.chats = chats;
    return chats;
  }

  async getChat(id: number): Promise<Chat | null> {
    const chat = this.chats.find((chat) => chat.id === id);
    return chat || null;
  }

  async addChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = await createChat(createChatDto);
    this.chats.push(chat);
    return chat;
  }

  async appendChat(chat: Chat): Promise<void> {
    this.chats.push(chat);
  }

  async updateChat(id: number, updateChatDto: UpdateChatDto): Promise<Chat> {
    const chat = await this.getChat(id);
    if (!chat) {
      throw new Error('Chat not found');
    }

    const updatedChat = await updateChat(id, updateChatDto);
    this.chats = this.chats.map((chat) =>
      chat.id === id ? updatedChat : chat
    );
    return updatedChat;
  }

  async deleteChat(id: number): Promise<void> {
    this.chats = this.chats.filter((chat) => chat.id !== id);
  }

  async getAllChatByGameId(gameId: number): Promise<Chat[]> {
    return this.chats.filter((chat) => chat.game === gameId);
  }

  async getAllChatByChannel(channel: string): Promise<Chat[]> {
    return this.chats.filter((chat) => chat.channel === channel);
  }

  async getAllChatWithUserId(userId: number): Promise<Chat[]> {
    return this.chats.filter(
      (chat) => chat.sender.id === userId || chat.receiver?.id === userId
    );
  }
}

export const chatRepository = new ChatRepository();
