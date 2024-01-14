import { Chess } from 'chess.js';

import {
  ABBREVIATION_TO_PIECE,
  FILES_LENGTH,
  RANKS_LENGTH,
} from 'constants/game.constant';
import { getSquareIndex } from 'scripts/utils';

const renderSquares = (boardDiv: HTMLDivElement) => {
  for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
    const rank = document.createElement('div');
    rank.classList.add('h-1/8', 'w-full');
    for (let rankIndex = RANKS_LENGTH - 1; rankIndex >= 0; rankIndex--) {
      const square = document.createElement('div');
      square.classList.add('h-full', 'w-full');
      // square.classList.add('min-h-12', 'min-w-12');
      square.setAttribute('data-square', getSquareIndex(fileIndex, rankIndex));
      if ((rankIndex + fileIndex) % 2 === 0) {
        square.classList.add('bg-[#b58863]');
      } else {
        square.classList.add('bg-[#f0d9b5]');
      }
      rank.appendChild(square);
    }
    boardDiv.appendChild(rank);
  }
};

const renderPieces = (
  boardDiv: HTMLDivElement,
  board: ReturnType<Chess['board']>
) => {
  for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
    for (let rankIndex = 0; rankIndex < RANKS_LENGTH; rankIndex++) {
      const square = board[RANKS_LENGTH - rankIndex - 1][fileIndex];
      if (!square) continue;

      // const squareId = getSquareIndex(fileIndex, rankIndex);
      // console.log('square: ', squareId, square.square, fileIndex, rankIndex);
      const { type, color, square: squareId } = square;
      const squareDiv = boardDiv.querySelector(`[data-square="${squareId}"]`);
      if (!squareDiv) continue;

      const piece = document.createElement('img');
      const fileName = `${color}${type.toUpperCase()}`;
      piece.src = `/images/${fileName}.png`;
      piece.alt = `${color === 'w' ? 'White' : 'Black'} ${
        ABBREVIATION_TO_PIECE[type]
      }`;
      // const piece = document.createElement('div');
      piece.classList.add('h-full', 'w-full');
      piece.setAttribute('data-piece', square.type);
      squareDiv.appendChild(piece);
    }
  }
};

export const renderBoard = (boardContainerId: string, fen: string) => {
  const boardContainer = document.getElementById(boardContainerId);
  if (!boardContainer) return;

  const boardDiv = document.createElement('div');
  boardDiv.classList.add(
    'grid',
    'grid-cols-8',
    'min-h-96',
    'min-w-96',
    'aspect-square'
  );
  renderSquares(boardDiv);
  boardContainer.appendChild(boardDiv);

  const chess = new Chess(fen);
  const board = chess.board();

  renderPieces(boardDiv, board);
};
