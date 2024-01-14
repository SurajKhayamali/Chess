import { Chess } from 'chess.js';

import {
  ABBREVIATION_TO_PIECE,
  FILES_LENGTH,
  RANKS_LENGTH,
} from 'constants/game.constant';
import { getSquareIndex } from 'scripts/utils';

const renderSquares = (boardDiv: HTMLDivElement) => {
  for (let rankIndex = RANKS_LENGTH - 1; rankIndex >= 0; rankIndex--) {
    const rank = document.createElement('div');
    rank.classList.add('h-1/8', 'w-full');
    for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
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

const renderPieces = (boardDiv: HTMLDivElement, fen: string) => {
  // console.log('fen: ', fen);
  // Render pieces
  const chess = new Chess(fen);
  // console.log('chess: ', chess);
  const board = chess.board();
  // console.log('board: ', board);

  for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
    for (let rankIndex = 0; rankIndex < RANKS_LENGTH; rankIndex++) {
      const square = board[fileIndex][rankIndex];
      if (!square) continue;

      const squareDiv = boardDiv.querySelector(
        `[data-square="${getSquareIndex(fileIndex, rankIndex)}"]`
      );
      if (!squareDiv) continue;

      const { type, color } = square;
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

  renderPieces(boardDiv, fen);
};
