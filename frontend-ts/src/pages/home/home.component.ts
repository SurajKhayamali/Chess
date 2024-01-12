// import { BOARD_ID } from 'constants/game.constant';
// import { reInitializeMessage } from 'scripts/message';
// import { generateBoardWithFENString } from 'scripts/parseFEN';

import {
  renderChatListComponent,
  renderNewChat,
} from 'components/chat/chat.component';
import { Chat } from 'entities/Chat';
import { ChatList } from 'entities/ChatList';
import { SocketEvent } from 'enums/socket.enum';
import { socket } from 'scripts/socket';

const dummyInitialChats = [
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

const chats = new ChatList(dummyInitialChats);

export const component = `
<div class="container">
  <h2>Play a New Online Game</h2>
</div>

<div id="chat-list-container" class="mt-32"></div>
<input id="chat-input" class="input input-bordered w-full mt-32" type="text" placeholder="Type a message" />
`;

// function render() {
//   const board = generateBoardWithFENString(BOARD_ID);
//   board.render();
//   board.reEvaluateGameState();

//   reInitializeMessage();
// }

export function afterInitialize() {
  // render();

  renderChatListComponent(chats.getChats());

  socket.on(SocketEvent.USER_MESSAGE, (message: unknown) => {
    console.log('Message received:', message);
    const chat = new Chat({
      message: message as string,
      sender: 'Backend',
      time: new Date().toLocaleTimeString(),
      isSeen: false,
    });
    chats.addChat(chat);

    renderNewChat(chat);
  });
}
