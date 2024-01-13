import { Chat } from 'entities/Chat';
import { CreateChatDto, UpdateChatDto } from 'interfaces/chat.interface';
import { createChat, getChats, updateChat } from 'services/chat.service';

class ChatRepository {
  chats: Chat[] = [];

  constructor() {
    this.getChats();
  }

  async getChats(): Promise<Chat[]> {
    const chats = await getChats();
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
      (chat) => chat.sender === userId || chat.receiver === userId
    );
  }
}

export const chatRepository = new ChatRepository();
