import {
  renderChatListComponent,
  renderNewChat,
} from 'components/chat/chat.component';
import { Chat } from 'entities/Chat';
import { ChatList } from 'entities/ChatList';
import { SocketEvent } from 'enums/socket.enum';
import { emit } from 'helpers/socket.helper';
import { socket } from 'scripts/socket';

export function renderChatContainer(
  constainerId: string,
  channelId: string = SocketEvent.PUBLIC_MESSAGE
) {
  const chatContainer = document.getElementById(constainerId);
  if (!chatContainer) {
    return;
  }

  chatContainer.innerHTML = /*html*/ `
    <div class="container">
      <div id="chat-list-container" class="mt-32"></div>
      <input id="chat-input" class="input input-bordered w-full mt-32" type="text" placeholder="Type a message" />
    </div>
  `;

  const chats = new ChatList();
  renderChatListComponent(chats.getChats());

  socket.on(channelId, (message: unknown) => {
    // console.log('Message received:', message);
    const chat = new Chat({
      message: message as string,
      sender: 'Backend',
      time: new Date().toLocaleTimeString(),
      isSeen: false,
    });
    chats.addChat(chat);

    renderNewChat(chat);
  });

  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = chatInput.value;
      emit(socket, SocketEvent.PUBLIC_MESSAGE, message);
      const chat = new Chat({
        message,
        sender: 'You',
        time: new Date().toLocaleTimeString(),
        isSeen: false,
      });
      chats.addChat(chat);
      renderNewChat(chat);
      chatInput.value = '';
    }
  });
}
