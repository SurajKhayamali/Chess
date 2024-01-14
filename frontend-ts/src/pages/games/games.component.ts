import { renderBoard } from 'components/board/board.component';

export const renderGames = () => /*html*/ `
  <div class="container">
    <div class="card bg-base-300">
      <div class="card-body">
        <div class="flex flex-col items-center">
          <p class="text-2xl">Past Games</p>
        </div>
      </div>
    </div>
  </div>
`;

export const renderGame = () => /*html*/ `
  <div id="boardContainer" class="container"></div>
`;

export const afterInitializeGame = async (slug: string) => {
  renderBoard('boardContainer', slug);
};
