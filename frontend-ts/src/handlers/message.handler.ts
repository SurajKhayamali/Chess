// import { Chat } from 'entities/Chat';
// import { ChatList } from 'entities/ChatList';
import { SocketEvent } from 'enums/socket.enum';
import { Socket } from 'socket.io-client';

export function registerMessageHandlers(socket: Socket) {
  // const chat = ChatList.getInstance();
  socket.on(SocketEvent.USER_MESSAGE, (message: unknown) => {
    console.log('Message received:', message);
    // chat.addChat(
    //   new Chat({
    //     message: message as string,
    //     sender: 'other',
    //     time: new Date().toLocaleTimeString(),
    //     isSeen: false,
    //   })
    // );
  });
}
