import { Chat } from '../entities/chat.entity';
import { BaseColumnsToOmit } from './base.interface';
import { UserResponse } from './user.interface';

export interface CreateChatDto extends Omit<Chat, BaseColumnsToOmit> {}

export interface CreateChatByUserDto extends Omit<CreateChatDto, 'sender'> {}

export interface UpdateChatDto extends Partial<CreateChatDto> {}

export interface ChatResponse extends Omit<Chat, 'sender' | 'receiver'> {
  sender: UserResponse;
  receiver?: UserResponse;
}

export interface QueryChatDto {
  channel?: string;
}
