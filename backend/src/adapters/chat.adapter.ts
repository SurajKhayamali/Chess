import { Chat } from '../entities/chat.entity';
import { ChatResponse } from '../interfaces/chat.interface';
import { UserAdapter } from './user.adapter';

export class ChatAdapter {
  static adaptForResponse(chat: Chat): ChatResponse {
    const { sender, receiver, ...rest } = chat;

    return {
      ...rest,
      sender: UserAdapter.adaptForResponse(sender),
      ...(receiver ? { receiver: UserAdapter.adaptForResponse(receiver) } : {}),
    };
  }

  static adaptAllForResponse(chats: Chat[]) {
    return chats.map((chat) => this.adaptForResponse(chat));
  }
}
