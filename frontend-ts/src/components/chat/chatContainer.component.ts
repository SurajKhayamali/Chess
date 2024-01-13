import {
  renderChatListComponent,
  renderNewChat,
} from 'components/chat/chat.component';
import { Chat } from 'entities/Chat';
import { SocketEvent } from 'enums/socket.enum';
import { emit } from 'helpers/socket.helper';
import { chatRepository } from 'repositories/chat.repository';
import { socket } from 'scripts/socket';

export async function renderChatContainer(
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

  await chatRepository.getChats();
  renderChatListComponent(await chatRepository.getAllChatByChannel(channelId));

  socket.on(channelId, (message: unknown) => {
    // console.log('Message received:', message);
    const chat = new Chat(message as Chat);
    chatRepository.appendChat(chat);

    renderNewChat(chat);
  });

  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const message = chatInput.value;
      emit(socket, SocketEvent.PUBLIC_MESSAGE, message);
      const chat = await chatRepository.addChat({
        message,
        channel: channelId,
      });
      renderNewChat(chat);
      chatInput.value = '';
    }
  });
}
