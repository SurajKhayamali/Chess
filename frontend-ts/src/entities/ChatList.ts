import { Chat } from './Chat';

export class ChatList {
  chats: Chat[];

  constructor(chats: Chat[] = []) {
    this.chats = chats;
  }

  addChat(chat: Chat) {
    this.chats.push(chat);
  }

  addChats(chats: Chat[]) {
    this.chats = [...this.chats, ...chats];
  }

  getChats() {
    return this.chats;
  }

  //   static instance = new ChatList();

  //   static getInstance() {
  //     return this.instance;
  //   }
}
