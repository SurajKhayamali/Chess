import { ChessBoard } from './ChessBoard';

// const renderNoGameFound = (boardContainer: HTMLElement) => {
//   const noGameFound = document.createElement('div');
//   noGameFound.classList.add('flex', 'flex-col', 'items-center', 'py-24');
//   noGameFound.innerHTML = /*html*/ `
//     <h1 class="text-3xl font-bold">No game found</h1>
//   `;
//   boardContainer.appendChild(noGameFound);
// };

export const renderBoard = async (boardContainerId: string, slug: string) => {
  // console.log('renderBoard', boardContainerId, slug);
  const chessboard = new ChessBoard(boardContainerId, slug);
  chessboard.render();

  //   if ((e as Error).message === 'Game not found')
  //     renderNoGameFound(boardContainer);
  // }
};
