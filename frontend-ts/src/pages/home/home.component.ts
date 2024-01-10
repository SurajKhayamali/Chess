// import { BOARD_ID } from 'constants/game.constant';
// import { reInitializeMessage } from 'scripts/message';
// import { generateBoardWithFENString } from 'scripts/parseFEN';

import { renderChatListComponent } from 'components/chat/chat.component';

const chats = [
  {
    sender: 'Obi-Wan Kenobi',
    message: 'You were the Chosen One!',
    time: '2 hours ago',
    isSeen: true,
  },
  {
    sender: 'Obi-Wan Kenobi',
    message: 'Test message',
    time: '2 hours ago',
    isSeen: false,
  },
  {
    sender: 'John Doe',
    message: 'Hello there',
    time: '2 hours ago',
    isSeen: true,
  },
  {
    sender: 'Alex Doe',
    message: 'Hello there',
    time: '2 hours ago',
    isSeen: true,
  },
];

export const component = `
<div class="container">
  <h2>Play a New Online Game</h2>
</div>

<div id="chat-list-container" class="mt-32"></div>
`;

// function render() {
//   const board = generateBoardWithFENString(BOARD_ID);
//   board.render();
//   board.reEvaluateGameState();

//   reInitializeMessage();
// }

export function afterInitialize() {
  // render();

  renderChatListComponent(chats);
}
