import { Chess } from 'chess.js';

import {
  ABBREVIATION_TO_PIECE,
  FILES_LENGTH,
  RANKS_LENGTH,
} from 'constants/game.constant';
import { getSquareIndex } from 'scripts/utils';

const renderSquares = (boardDiv: HTMLDivElement, allowMove: boolean) => {
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

      if (!allowMove) continue;
      square.ondragover = (e) => {
        // console.log('drag over', e);
        e.preventDefault(); // Necessary. Allows us to drop.
      };
      square.ondrop = (e) => {
        console.log('drop', e);
        e.preventDefault();
        const data = e.dataTransfer?.getData('text/plain');
        console.log('data: ', data);
        if (!data) return;
        const piece = document.querySelector(`[data-piece="${data}"]`);
        if (!piece) return;
        square.appendChild(piece);
        // const piece = e.dataTransfer?.getData('text/html');
        // if (!piece) return;
        // square.innerHTML = piece;
        // square.appendChild(piece as unknown as Node);
      };
    }
    boardDiv.appendChild(rank);
  }
};

const renderPieces = (
  boardDiv: HTMLDivElement,
  board: ReturnType<Chess['board']>,
  allowMove = false
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
      piece.classList.add('h-full', 'w-full', 'cursor-grab');
      const pieceId = `${color}${type}:${squareId}`;
      piece.setAttribute('data-piece', `${pieceId}`);
      squareDiv.appendChild(piece);

      if (!allowMove) continue;
      piece.draggable = true;
      piece.ondragstart = (e) => {
        // e.preventDefault();
        console.log('drag start', e);
        e.dataTransfer?.setData('text/plain', pieceId);
        e.dataTransfer?.setData('text/html', piece.outerHTML);
        // e.dataTransfer?.setDragImage(piece, 0, 0);
      };
    }
  }
};

export const renderBoard = (
  boardContainerId: string,
  fen: string,
  allowMove = false
) => {
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
  renderSquares(boardDiv, allowMove);
  boardContainer.appendChild(boardDiv);

  const chess = new Chess(fen);
  const board = chess.board();

  renderPieces(boardDiv, board, allowMove);
};
