import { Chat } from 'entities/Chat';
import { User } from './user.interface';

export interface IChat {
  id: number;
  sender: User;
  receiver?: User; // only exists if private message
  game?: number; // only exists if game message
  channel?: string; // only exists if channel message, e.g. 'public-message'
  message: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateChatDto extends Pick<Chat, 'message' | 'channel'> {}

export interface UpdateChatDto
  extends Partial<Omit<CreateChatDto, 'channel'>> {}
