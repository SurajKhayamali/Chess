import { IChat } from 'interfaces/chat.interface';
import { BaseEntity } from './Base.entity';
import { User } from 'interfaces/user.interface';

export class Chat extends BaseEntity implements IChat {
  sender: User;
  receiver?: User;
  game?: number;
  channel?: string;
  message: string;

  constructor(chat: Chat) {
    super(chat);
    this.sender = chat.sender;
    this.receiver = chat.receiver;
    this.game = chat.game;
    this.channel = chat.channel;
    this.message = chat.message;
  }
}
