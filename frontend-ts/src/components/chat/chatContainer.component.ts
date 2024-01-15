import {
  renderChatListComponent,
  renderNewChat,
} from 'components/chat/chat.component';
import { Chat } from 'entities/Chat';
import { SocketEvent } from 'enums/socket.enum';
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
    <div id="chat-list-container" class="mt-12 h-[60vh] overflow-y-scroll"></div>
    <input id="chat-input" class="input input-bordered w-full mt-4" type="text" placeholder="Type a message" />
  `;

  await chatRepository.getChats();
  renderChatListComponent(await chatRepository.getAllChatByChannel(channelId));

  socket.on(channelId, (chatRes: Chat) => {
    // console.log('Message received:', message);
    const chat = new Chat(chatRes);
    chatRepository.appendChat(chat);

    renderNewChat(chat);
  });

  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  chatInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const message = chatInput.value;
      const chat = await chatRepository.addChat({
        message,
        channel: channelId,
      });
      renderNewChat(chat);
      chatInput.value = '';
    }
  });
}
