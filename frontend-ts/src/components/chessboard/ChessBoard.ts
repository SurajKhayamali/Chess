import { Chess, Color, Square, Piece } from 'chess.js';

import {
  ABBREVIATION_TO_PIECE,
  AUTO_PROMOTE_PIECE_TO,
  FILES_LENGTH,
  RANKS_LENGTH,
} from 'constants/game.constant';
import {
  PieceHighlightModifiers,
  SquareHighlightModifiers,
} from 'enums/game.enum';
import { getUserInfo } from 'helpers/auth.helper';
import {
  getIsPlayerAllowedToMove,
  getIsPlayerPlaying,
  getIsPlayerWhite,
  synchronizeGameWithChess,
} from 'helpers/game.helper';
import { ToastType, displayToast } from 'helpers/toast.helper';
import { Game, RecordMoveDto } from 'interfaces/game.interface';
import {
  getClassNameForPieceHigilight,
  getClassNameForSquareHigilight,
  getSquareIndex,
} from 'scripts/utils';
import {
  getGameBySlug,
  joinGameStream,
  recordMove,
} from 'services/game.service';

const SQUARE_ATTRIBUTE_NAME = 'data-square';
const PIECE_ATTRIBUTE_NAME = 'data-piece-at-square';

const renderNoGameFound = (boardContainer: HTMLElement) => {
  boardContainer.innerHTML = '';

  const noGameFound = document.createElement('div');
  noGameFound.classList.add('flex', 'flex-col', 'items-center', 'py-24');
  noGameFound.innerHTML = /*html*/ `
    <h1 class="text-3xl font-bold">No game found</h1>
  `;
  boardContainer.appendChild(noGameFound);
};

export class ChessBoard {
  private boardContainer: HTMLDivElement;
  private game?: Game;
  private chess: Chess;
  private allowMove: boolean;
  private turn: Color;
  private isPlayerWhite?: boolean;
  // private userId?: number;
  private isPlaying: boolean;
  private lastMove?: RecordMoveDto;

  constructor(boardContainerId: string, slug: string) {
    const boardContainer = document.getElementById(
      boardContainerId
    ) as HTMLDivElement;
    if (!boardContainer) throw new Error('boardContainer is required');

    this.boardContainer = boardContainer;

    this.chess = new Chess();
    this.turn = 'w';
    this.isPlaying = false;
    this.allowMove = false;

    this.fetchGame(slug);
  }

  get gameId() {
    return this.game?.id;
  }

  private async fetchGame(slug: string) {
    try {
      const game = await getGameBySlug(slug);
      // console.log('game: ', game);

      const chess = new Chess();
      chess.loadPgn(game.pgn);
      const turn = chess.turn();
      const userId = getUserInfo()?.userId;
      const isPlayerWhite = getIsPlayerWhite(game, userId);

      this.game = game;
      this.chess = chess;
      this.turn = turn;
      this.isPlayerWhite = isPlayerWhite;
      // this.userId = userId;
      this.isPlaying = getIsPlayerPlaying(game, userId);
      this.reEvaluatePlayerAllowedToMove();

      this.render();

      joinGameStream(game.slug, (recordMoveDto) => {
        // console.log('Game received:', recordMoveDto);
        this.handleMove(recordMoveDto);
      });
    } catch (error) {
      console.log(error);
      displayToast('Game not found', ToastType.ERROR);
      renderNoGameFound(this.boardContainer);
    }
  }

  private async reEvaluatePlayerAllowedToMove() {
    this.allowMove = getIsPlayerAllowedToMove(
      this.turn === 'w',
      this.isPlayerWhite
    );
  }

  private renderSquareAndPieces() {
    this.boardContainer.innerHTML = '';
    const boardDiv = document.createElement('div');
    boardDiv.classList.add(
      'grid',
      'grid-cols-8',
      'min-h-12',
      'min-w-12',
      // 'lg:h-96',
      // 'lg:w-96',
      'max-h-[60vh]',
      'max-w-[60vw]',
      'aspect-square'
    );
    if (!this.isPlayerWhite) boardDiv.classList.add('transform', 'rotate-180');

    for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
      const rank = document.createElement('div');
      rank.classList.add('h-1/8', 'w-full');
      for (let rankIndex = RANKS_LENGTH - 1; rankIndex >= 0; rankIndex--) {
        const square = document.createElement('div');
        square.classList.add('h-full', 'w-full');
        const squareId = getSquareIndex(fileIndex, rankIndex);
        square.setAttribute(SQUARE_ATTRIBUTE_NAME, squareId);
        if ((rankIndex + fileIndex) % 2 === 0) {
          square.classList.add('bg-dark');
        } else {
          square.classList.add('bg-light');
        }

        if (this.lastMove) {
          const { from, to } = this.lastMove;
          if (from === squareId || to === squareId) {
            square.classList.add(
              getClassNameForSquareHigilight(SquareHighlightModifiers.LAST_MOVE)
            );
          }
        }

        const piece = this.chess.get(squareId);
        if (piece) {
          const pieceEl = this.renderPiece(piece, squareId);
          square.appendChild(pieceEl);
        }

        rank.appendChild(square);

        if (!this.allowMove) continue;
        square.ondragover = (e) => {
          // console.log('drag over', e);
          e.preventDefault(); // Necessary. Allows us to drop.
        };
        square.ondragenter = () => {
          // console.log('drag enter', e);
          this.removeHighlightFromAllSquares(SquareHighlightModifiers.HOVER);

          const isValidSquare = square.classList.contains(
            getClassNameForSquareHigilight(SquareHighlightModifiers.VALID)
          );
          if (!isValidSquare) return;

          square.classList.add(
            getClassNameForSquareHigilight(SquareHighlightModifiers.HOVER)
          );
        };
        square.ondrop = (e) => {
          // console.log('drop', e);
          e.preventDefault();
          const oldSquareId = e.dataTransfer?.getData('text/plain') as Square;
          // console.log('oldSquareId: ', oldSquareId);
          if (!oldSquareId) return;
          const piece = document.querySelector(
            `[${PIECE_ATTRIBUTE_NAME}="${oldSquareId}"]`
          );
          if (!piece) return;

          const move = {
            from: oldSquareId,
            to: squareId,
            promotion: AUTO_PROMOTE_PIECE_TO,
          };

          this.recordMove(move);
          // piece.setAttribute(PIECE_ATTRIBUTE_NAME, squareId);
          // square.appendChild(piece);
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
      <div>${
        this.game?.isOver
          ? 'Game Over'
          : this.isPlaying
          ? 'Playing'
          : 'Spectating'
      }</div>
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

  private renderPiece(piece: Piece, squareId: Square) {
    const { color, type } = piece;
    const pieceEl = document.createElement('img');
    const fileName = `${color}${type.toUpperCase()}`;
    pieceEl.src = `/images/${fileName}.png`;
    pieceEl.alt = `${color === 'w' ? 'White' : 'Black'} ${
      ABBREVIATION_TO_PIECE[type]
    }`;
    pieceEl.setAttribute(PIECE_ATTRIBUTE_NAME, squareId);
    pieceEl.classList.add('h-full', 'w-full', 'cursor-grab');
    if (!this.isPlayerWhite) pieceEl.classList.add('transform', 'rotate-180');

    if (type === 'k') {
      const isAttacked = this.chess.isAttacked(
        squareId,
        color === 'w' ? 'b' : 'w'
      );
      if (isAttacked) {
        pieceEl.classList.add(
          getClassNameForPieceHigilight(PieceHighlightModifiers.CHECKED)
        );
      }
    }

    if (!this.allowMove) return pieceEl;
    if (this.turn !== color) {
      pieceEl.draggable = false;
      return pieceEl;
    }

    pieceEl.draggable = true;
    pieceEl.ondragstart = (e) => {
      // e.preventDefault();
      // console.log('drag start', e);
      const squareId = pieceEl.getAttribute(PIECE_ATTRIBUTE_NAME) as Square;
      e.dataTransfer?.setData('text/plain', squareId);

      this.handlePieceClickOrDrag(squareId);
    };

    pieceEl.onclick = () => {
      // console.log('piece clicked', e);
      const squareId = pieceEl.getAttribute(PIECE_ATTRIBUTE_NAME) as Square;
      this.handlePieceClickOrDrag(squareId);
    };

    return pieceEl;
  }

  private highlightSquare(
    squareId: Square,
    modifier: SquareHighlightModifiers
  ) {
    const square = document.querySelector(
      `[${SQUARE_ATTRIBUTE_NAME}="${squareId}"]`
    );
    if (!square) return;

    square.classList.add(getClassNameForSquareHigilight(modifier));
  }

  private removeHighlightFromAllSquares(modifier: SquareHighlightModifiers) {
    const className = getClassNameForSquareHigilight(modifier);
    const squares = document.querySelectorAll(`.${className}`);

    for (const square of squares) {
      square.classList.remove(className);
    }
  }

  private getPossibleMoves(squareId: Square) {
    const moves = this.chess.moves({ square: squareId, verbose: true });
    return moves;
  }

  private highlightPossibleMoves(squareId: Square) {
    this.removeHighlightFromAllSquares(SquareHighlightModifiers.VALID);

    const moves = this.getPossibleMoves(squareId);

    for (const move of moves) {
      const { to, captured } = move;
      if (captured) {
        this.highlightSquare(to, SquareHighlightModifiers.CAPTURABLE);
        continue;
      }
      this.highlightSquare(move.to, SquareHighlightModifiers.VALID);
    }
  }

  private handlePieceClickOrDrag(squareId: Square) {
    this.removeHighlightFromAllSquares(SquareHighlightModifiers.SELECTED);
    if (!this.allowMove) return;

    this.highlightSquare(squareId, SquareHighlightModifiers.SELECTED);

    this.highlightPossibleMoves(squareId);
  }

  private async validateMove(props: RecordMoveDto): Promise<boolean> {
    const { from, to } = props;
    const moves = this.getPossibleMoves(from);
    const move = moves.find((move) => move.to === to);
    return !!move;
  }

  private async recordMove(props: RecordMoveDto): Promise<boolean> {
    if (!this.validateMove(props) || !this.gameId) return false;

    try {
      await recordMove(this.gameId, props);
      // const game = await recordMove(this.gameId, props);
      // console.log('game: ', game);

      return true;
    } catch (error) {
      // console.error(error);
      displayToast('Invalid move', ToastType.ERROR);
      return false;
    }
  }

  private async handleMove(props: RecordMoveDto): Promise<boolean> {
    try {
      const move = this.chess.move(props);
      if (!move) return false;

      this.lastMove = props;
      this.turn = this.chess.turn();
      this.allowMove = !this.allowMove;
      // this.reEvaluatePlayerAllowedToMove();
      synchronizeGameWithChess(this.game!, this.chess);
      this.render();
      return true;
    } catch (error) {
      // console.error(error);
      displayToast('Invalid move', ToastType.ERROR);
      return false;
    }
  }

  render() {
    if (!this.game) {
      renderNoGameFound(this.boardContainer);
      return;
    }

    this.renderSquareAndPieces();
  }
}
