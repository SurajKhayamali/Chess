import { Chess, Color } from 'chess.js';

import {
  ABBREVIATION_TO_PIECE,
  FILES_LENGTH,
  RANKS_LENGTH,
} from 'constants/game.constant';
import { getUserInfo } from 'helpers/auth.helper';
import { getSquareIndex } from 'scripts/utils';
import { getGameBySlug } from 'services/game.service';

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
  allowMove = false,
  turn?: Color
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
      if (turn !== color) {
        piece.draggable = false;
        continue;
      }

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

const renderNoGameFound = (boardContainer: HTMLElement) => {
  const noGameFound = document.createElement('div');
  noGameFound.classList.add('flex', 'flex-col', 'items-center', 'py-24');
  noGameFound.innerHTML = /*html*/ `
    <h1 class="text-3xl font-bold">No game found</h1>
  `;
  boardContainer.appendChild(noGameFound);
};

const getIsPlayerAllowedToMove = (
  isWhitesTurn: boolean,
  isPlayerWhite?: boolean
) => {
  if (isPlayerWhite === undefined) return false;
  return isWhitesTurn === isPlayerWhite;
};

export const renderBoard = async (boardContainerId: string, slug: string) => {
  const boardContainer = document.getElementById(boardContainerId);
  if (!boardContainer) return;
  try {
    const game = await getGameBySlug(slug);
    // console.log('game: ', game);

    const fen = game.initialBoardState;

    const chess = new Chess(fen);
    const board = chess.board();

    const userId = getUserInfo()?.userId;
    const turn = chess.turn();
    const isWhitesTurn = turn === 'w';
    const isPlayerWhite = userId ? game.whitePlayer?.id === userId : undefined;
    // console.log('isPlayerWhite: ', isPlayerWhite);
    const allowMove =
      !game.isOver && getIsPlayerAllowedToMove(isWhitesTurn, isPlayerWhite);
    // console.log('allowMove: ', allowMove);

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

    renderPieces(boardDiv, board, allowMove, turn);
  } catch (e) {
    console.log(e);

    if ((e as Error).message === 'Game not found')
      renderNoGameFound(boardContainer);
  }
};
