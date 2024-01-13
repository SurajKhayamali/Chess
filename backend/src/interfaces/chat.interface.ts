import { Chat } from '../entities/chat.entity';
import { BaseColumnsToOmit } from './base.interface';

export interface CreateChatDto extends Omit<Chat, BaseColumnsToOmit> {}

export interface CreateChatByUserDto extends Omit<CreateChatDto, 'sender'> {}

export interface UpdateChatDto extends Partial<CreateChatDto> {}
