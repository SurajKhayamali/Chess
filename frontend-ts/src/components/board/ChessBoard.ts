import { Chess, Color, Square, Piece } from 'chess.js';

import {
  ABBREVIATION_TO_PIECE,
  FILES_LENGTH,
  RANKS_LENGTH,
} from 'constants/game.constant';
import { getUserInfo } from 'helpers/auth.helper';
import { ToastType, displayToast } from 'helpers/toast.helper';
import { Game } from 'interfaces/game.interface';
import { getSquareIndex } from 'scripts/utils';
import { getGameBySlug } from 'services/game.service';

interface IMove {
  oldSquareId: string;
  newSquareId: string;
}

const SQUARE_ATTRIBUTE_NAME = 'data-square';
const PIECE_ATTRIBUTE_NAME = 'data-piece-at-square';

const getIsPlayerAllowedToMove = (
  isWhitesTurn: boolean,
  isPlayerWhite?: boolean
) => {
  if (isPlayerWhite === undefined) return false;
  return isWhitesTurn === isPlayerWhite;
};

export class ChessBoard {
  private boardContainer: HTMLDivElement;
  private chess: Chess;
  private allowMove: boolean;
  private turn: Color;
  private isPlayerWhite?: boolean;
  private game?: Game;
  private userId?: number;

  constructor(boardContainerId: string, slug: string) {
    const boardContainer = document.getElementById(
      boardContainerId
    ) as HTMLDivElement;
    if (!boardContainer) throw new Error('boardContainer is required');

    this.boardContainer = boardContainer;

    this.chess = new Chess();
    this.allowMove = false;
    this.turn = 'w';
    this.isPlayerWhite = false;

    // console.log('slug: ', slug);
    getGameBySlug(slug)
      .then((game) => {
        // console.log('game: ', game);

        const chess = new Chess(game.initialBoardState);
        const turn = chess.turn();
        const userId = getUserInfo()?.userId;
        const isWhitesTurn = turn === 'w';
        const isPlayerWhite = userId
          ? game.whitePlayer?.id === userId
          : undefined;

        this.game = game;
        this.chess = chess;
        this.turn = turn;
        this.allowMove =
          !game.isOver && getIsPlayerAllowedToMove(isWhitesTurn, isPlayerWhite);
        this.isPlayerWhite = isPlayerWhite;
        this.userId = userId;

        this.render();
      })
      .catch((error) => {
        console.error(error);
        displayToast('Game not found', ToastType.ERROR);
      });
  }

  private renderSquareAndPieces() {
    this.boardContainer.innerHTML = '';
    const boardDiv = document.createElement('div');
    boardDiv.classList.add(
      'grid',
      'grid-cols-8',
      'min-h-12',
      'min-w-12',
      'lg:h-192',
      'lg:w-192',
      'aspect-square'
    );
    for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
      const rank = document.createElement('div');
      rank.classList.add('h-1/8', 'w-full');
      for (let rankIndex = RANKS_LENGTH - 1; rankIndex >= 0; rankIndex--) {
        const square = document.createElement('div');
        square.classList.add('h-full', 'w-full');
        const squareId = getSquareIndex(fileIndex, rankIndex);
        square.setAttribute(SQUARE_ATTRIBUTE_NAME, squareId);
        if ((rankIndex + fileIndex) % 2 === 0) {
          square.classList.add('bg-[#b58863]');
        } else {
          square.classList.add('bg-[#f0d9b5]');
        }

        const piece = this.chess.get(squareId as Square);
        if (piece) {
          const pieceEl = this.renderPiece(piece);
          pieceEl.setAttribute(PIECE_ATTRIBUTE_NAME, squareId);
          square.appendChild(pieceEl);
        }

        rank.appendChild(square);

        if (!this.allowMove) continue;
        square.ondragover = (e) => {
          // console.log('drag over', e);
          e.preventDefault(); // Necessary. Allows us to drop.
        };
        square.ondrop = (e) => {
          console.log('drop', e);
          e.preventDefault();
          const oldSquareId = e.dataTransfer?.getData('text/plain');
          console.log('oldSquareId: ', oldSquareId);
          if (!oldSquareId) return;
          const piece = document.querySelector(
            `[${PIECE_ATTRIBUTE_NAME}="${oldSquareId}"]`
          );
          if (!piece) return;

          const moveMade = this.handleMove({
            oldSquareId: oldSquareId,
            newSquareId: squareId,
          });
          if (!moveMade) return;

          piece.setAttribute(PIECE_ATTRIBUTE_NAME, squareId);
          square.appendChild(piece);
        };
      }
      boardDiv.appendChild(rank);
    }
    this.boardContainer.appendChild(boardDiv);

    const statusDiv = document.createElement('div');
    statusDiv.id = 'status';
    statusDiv.classList.add('mt-4');
    statusDiv.innerHTML = /*html*/ `
      <label>Status:</label>
      <div>${this.game?.isOver ? 'Game Over' : 'Playing'}</div>
    `;
    this.boardContainer.appendChild(statusDiv);

    const fenDiv = document.createElement('div');
    fenDiv.id = 'fen';
    fenDiv.classList.add('mt-4');
    fenDiv.innerHTML = /*html*/ `
      <label>FEN:</label>
      <div>${this.chess.fen()}</div>
    `;
    this.boardContainer.appendChild(fenDiv);

    const pgnDiv = document.createElement('div');
    pgnDiv.id = 'pgn';
    pgnDiv.classList.add('mt-4');
    pgnDiv.innerHTML = /*html*/ `
      <label>PGN:</label>
      <div>${this.chess.pgn()}</div>
    `;
    this.boardContainer.appendChild(pgnDiv);
  }

  private renderPiece(piece: Piece) {
    const { color, type } = piece;
    const pieceEl = document.createElement('img');
    const fileName = `${color}${type.toUpperCase()}`;
    pieceEl.src = `/images/${fileName}.png`;
    pieceEl.alt = `${color === 'w' ? 'White' : 'Black'} ${
      ABBREVIATION_TO_PIECE[type]
    }`;
    pieceEl.classList.add('h-full', 'w-full', 'cursor-grab');
    // pieceEl.setAttribute(PIECE_ATTRIBUTE_NAME, squareId);
    // squareDiv.appendChild(piece);

    if (!this.allowMove) return pieceEl;
    if (this.turn !== color) {
      pieceEl.draggable = false;
      return pieceEl;
    }

    pieceEl.draggable = true;
    pieceEl.ondragstart = (e) => {
      // e.preventDefault();
      console.log('drag start', e);
      e.dataTransfer?.setData(
        'text/plain',
        pieceEl.getAttribute(PIECE_ATTRIBUTE_NAME) as string
      );
    };

    return pieceEl;
  }

  private handleMove(props: IMove): boolean {
    const { oldSquareId, newSquareId } = props;
    try {
      const move = this.chess.move({
        from: oldSquareId,
        to: newSquareId,
        promotion: 'q',
      });
      if (!move) return false;
      this.turn = this.chess.turn();
      this.render();
      return true;
    } catch (error) {
      // console.error(error);
      displayToast('Invalid move', ToastType.ERROR);
      return false;
    }
  }

  render() {
    this.renderSquareAndPieces();
  }
}
