import { renderBoard } from 'components/board/board.component';
import { getGameBySlug } from 'services/game.service';

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
  const game = await getGameBySlug(slug);
  console.log('game: ', game);
  renderBoard('boardContainer');
};
