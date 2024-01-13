// import { BOARD_ID } from 'constants/game.constant';
// import { reInitializeMessage } from 'scripts/message';
// import { generateBoardWithFENString } from 'scripts/parseFEN';

import { renderChatContainer } from 'components/chat/chatContainer.component';
import { SocketEvent } from 'enums/socket.enum';

export const component = /*html*/ `
  <div class="container">
    <div id="home-chat-container"></div>
  </div>
`;

// function render() {
//   const board = generateBoardWithFENString(BOARD_ID);
//   board.render();
//   board.reEvaluateGameState();

//   reInitializeMessage();
// }

export function afterInitialize() {
  renderChatContainer('home-chat-container', SocketEvent.PUBLIC_MESSAGE);
}
