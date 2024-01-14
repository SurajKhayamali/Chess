// import { BOARD_ID } from 'constants/game.constant';
// import { reInitializeMessage } from 'scripts/message';
// import { generateBoardWithFENString } from 'scripts/parseFEN';

// import { renderChatContainer } from 'components/chat/chatContainer.component';
// import { SocketEvent } from 'enums/socket.enum';

export const component = /*html*/ `
  <div class="container">
    <div class="grid grid-cols-3 gap-4">
      <div class="card card-compact bg-base-300 transition-colors hover:bg-primary">
        <div class="card-body items-center">
          <p class="card-title">1 + 0</p>
          <p class="card-description">Bullet</p>
        </div>
      </div>
      <div class="card card-compact bg-base-300 transition-colors hover:bg-primary">
        <div class="card-body items-center">
          <p class="card-title">3 + 0</p>
          <p class="card-description">Blitz</p>
        </div>
      </div>
      <div class="card card-compact bg-base-300 transition-colors hover:bg-primary">
        <div class="card-body items-center">
          <p class="card-title">5 + 0</p>
          <p class="card-description">Blitz</p>
        </div>
      </div>
      <div class="card card-compact bg-base-300 transition-colors hover:bg-primary">
        <div class="card-body items-center">
          <p class="card-title">10 + 0</p>
          <p class="card-description">Rapid</p>
        </div>
      </div>
      <div class="card card-compact bg-base-300 transition-colors hover:bg-primary">
        <div class="card-body items-center">
          <p class="card-title">30 + 0</p>
          <p class="card-description">Classical</p>
        </div>
      </div>
      <div class="card card-compact bg-base-300 transition-colors hover:bg-primary">
        <div class="card-body items-center">
          <p class="card-title">No Time Limit</p>
        </div>
      </div>
    </div>
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
}
