export class Chat {
  sender: string;
  message: string;
  time: string;
  isSeen: boolean;

  constructor(chat: Chat) {
    this.sender = chat.sender;
    this.message = chat.message;
    this.time = chat.time;
    this.isSeen = chat.isSeen;
  }
}
