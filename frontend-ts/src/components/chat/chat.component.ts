interface Chat {
  sender: string;
  message: string;
  time: string;
  isSeen: boolean;
}

const currentUser = 'You';
function renderChatComponent(chat: Chat) {
  const sentByCurrentUser = chat.sender === currentUser;
  const chatAlignClass = sentByCurrentUser ? 'chat-end' : 'chat-start';

  return `
    <div class="chat ${chatAlignClass}">
        <div class="chat-header">
            ${chat.sender}
            <time class="text-xs opacity-50">${chat.time}</time>
        </div>
        <div class="chat-bubble">${chat.message}</div>
        <div class="chat-footer opacity-50">
            ${chat.isSeen ? 'Seen' : 'Delivered'}
        </div>
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
