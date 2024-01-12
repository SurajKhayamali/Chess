import { AppDataSource } from '../database/data-source';
import { Chat } from '../entities/chat.entity';

export const ChatRepository = AppDataSource.getRepository(Chat);
