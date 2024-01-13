import { renderChatContainer } from 'components/chat/chatContainer.component';
import { SocketEvent } from 'enums/socket.enum';

export const component = /*html*/ `
<div class="container">
  <div id="public-chat-container"></div>
</div>
`;

export function afterInitialize() {
  renderChatContainer('public-chat-container', SocketEvent.PUBLIC_MESSAGE);
}
