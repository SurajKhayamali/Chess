import { FILES_LENGTH, RANKS_LENGTH } from 'constants/game.constant';

export const renderBoard = (boardContainerId: string) => {
  const boardContainer = document.getElementById(boardContainerId);
  if (!boardContainer) return;

  const board = document.createElement('div');
  board.classList.add('grid', 'grid-cols-8', 'h-96', 'w-96');
  boardContainer.appendChild(board);

  for (let i = RANKS_LENGTH - 1; i >= 0; i--) {
    const rank = document.createElement('div');
    rank.classList.add('grid', 'grid-cols-8');
    for (let j = 0; j < FILES_LENGTH; j++) {
      const square = document.createElement('div');
      square.classList.add('h-full', 'w-full');
      if ((i + j) % 2 === 0) {
        square.classList.add('bg-[#b58863]');
      } else {
        square.classList.add('bg-[#f0d9b5]');
      }
      board.appendChild(square);
    }
  }
};
