// import { BOARD_ID } from 'constants/game.constant';
// import { reInitializeMessage } from 'scripts/message';
// import { generateBoardWithFENString } from 'scripts/parseFEN';

import { TIME_VARIANTS } from 'constants/game.constant';
import { TimeVariant } from 'interfaces/game.interface';
import { handleNavigation } from 'scripts/router';

// import { renderChatContainer } from 'components/chat/chatContainer.component';
// import { SocketEvent } from 'enums/socket.enum';

const renderTimeVariant = ({
  title,
  description,
  value,
}: TimeVariant) => /*html*/ `
  <div class="card card-compact cursor-pointer bg-base-300 transition-colors hover:bg-primary" data-value="${value}">
    <div class="card-body items-center">
      <p class="card-title">${title}</p>
      ${description ? `<p class="card-description">${description}</p>` : ''}
    </div>
  </div>
`;

const renderTimeVariants = () => /*html*/ `
  <div id="gameModeOptions" class="grid grid-cols-3 gap-4">
    ${TIME_VARIANTS.map(renderTimeVariant).join('')}
  </div>
`;

export const component = /*html*/ `
  <div class="container">
    ${renderTimeVariants()}
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

      handleNavigation(`/gameQueue/${timeLimit}`);
    });
  });
}
