import { Chat } from 'entities/Chat';
import { getUserInfo } from 'helpers/auth.helper';

function renderChatComponent(chat: Chat) {
  const userInfo = getUserInfo();
  if (!userInfo) return '';

  const sentByCurrentUser = chat.sender === userInfo.userId;
  const chatAlignClass = sentByCurrentUser ? 'chat-end' : 'chat-start';

  return `
    <div class="chat ${chatAlignClass}">
        <div class="chat-header">
            ${chat.sender}
            <time class="text-xs opacity-50">${chat.createdAt}</time>
        </div>
        <div class="chat-bubble">${chat.message}</div>
    </div>
    `;
}

export function renderChatListComponent(chats: Chat[]) {
  const chatContainer = document.querySelector('#chat-list-container');
  if (!chatContainer) {
    return;
  }

  chatContainer.innerHTML = chats.map(renderChatComponent).join('');
}

export function renderNewChat(chat: Chat) {
  const chatContainer = document.querySelector('#chat-list-container');
  if (!chatContainer) {
    return;
  }

  chatContainer.innerHTML += renderChatComponent(chat);
}
