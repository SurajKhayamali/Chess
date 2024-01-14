// import { BOARD_ID } from 'constants/game.constant';
// import { reInitializeMessage } from 'scripts/message';
// import { generateBoardWithFENString } from 'scripts/parseFEN';

import { handleNavigation } from 'scripts/router';

// import { renderChatContainer } from 'components/chat/chatContainer.component';
// import { SocketEvent } from 'enums/socket.enum';

interface GameMode {
  title: string;
  description?: string;
  value?: number;
}

const gameModes: GameMode[] = [
  {
    title: '1 + 0',
    description: 'Bullet',
    value: 60,
  },
  {
    title: '3 + 0',
    description: 'Blitz',
    value: 180,
  },
  {
    title: '5 + 0',
    description: 'Blitz',
    value: 300,
  },
  {
    title: '10 + 0',
    description: 'Rapid',
    value: 600,
  },
  {
    title: '30 + 0',
    description: 'Classical',
    value: 1800,
  },
  {
    title: 'No Time Limit',
    description: 'Casual',
    value: 0,
  },
];

const renderGameMode = ({ title, description, value }: GameMode) => /*html*/ `
  <div class="card card-compact cursor-pointer bg-base-300 transition-colors hover:bg-primary" data-value="${value}">
    <div class="card-body items-center">
      <p class="card-title">${title}</p>
      ${description ? `<p class="card-description">${description}</p>` : ''}
    </div>
  </div>
`;

const renderGameModes = () => /*html*/ `
  <div id="gameModeOptions" class="grid grid-cols-3 gap-4">
    ${gameModes.map(renderGameMode).join('')}
  </div>
`;

export const component = /*html*/ `
  <div class="container">
    ${renderGameModes()}
    <!-- <div id="home-chat-container"></div> -->
  </div>
`;

// function render() {
//   const board = generateBoardWithFENString(BOARD_ID);
//   board.render();
//   board.reEvaluateGameState();

//   reInitializeMessage();
// }

export function afterInitialize() {
  // renderChatContainer('home-chat-container', SocketEvent.PUBLIC_MESSAGE);

  const gameModeOptions = document.querySelectorAll('#gameModeOptions .card');

  gameModeOptions.forEach((gameModeOption) => {
    gameModeOption.addEventListener('click', () => {
      const timeLimit = gameModeOption.getAttribute('data-value');

      console.log('Lets play a game with time limit: ', timeLimit);
      // TODO: Create a new game

      handleNavigation(`/gameQueue/${timeLimit}`);
    });
  });
}
