import {
  FILES_LENGTH,
  RANKS_LENGTH,
  SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS,
} from 'constants/game.constant';
import { addToPossibleAndCapturableMoves } from './helpers/common.helper';
import { GameControl } from 'entities/GameControl';
import { King } from './King';
import { PieceHighlightModifiers } from 'enums/game.enum';
import { Moves } from 'interfaces/game.interface';

interface PossibleMovesResult {
  possibleMoves: number[][];
  capturablePieces: number[][];
}

export type PieceConstructorArgsWithoutName = [
  isWhite: boolean,
  fileIndex: number,
  rankIndex: number,
  control: GameControl | undefined,
  abbreviation: string
];

/**
 * Abstract class for all pieces
 * @abstract exporting for type annotation in jsdoc only
 */
export class Piece {
  name: string;
  abbreviation: string;
  isWhite: boolean;
  fileIndex: number;
  rankIndex: number;
  control: GameControl | undefined;
  hasMoved: boolean;
  htmlElement: HTMLElement;
  possibleMoves: PossibleMovesResult;
  canAttackOponentKing: boolean;

  /**
   * Creates a piece
   *
   * @param name - name of the piece
   * @param isWhite - true if the piece is white, false if black
   * @param fileIndex - index of the file the piece is on
   * @param rankIndex - index of the rank the piece is on
   * @param control - the piece's control, optional
   * @param abbreviation - abbreviation of the piece, optional
   */
  constructor(
    name: string,
    isWhite: boolean,
    fileIndex: number,
    rankIndex: number,
    control: GameControl | undefined,
    abbreviation: string
  ) {
    this.name = name;
    this.abbreviation = abbreviation || name?.[0]?.toUpperCase();
    this.isWhite = isWhite;
    this.fileIndex = fileIndex; // stored as 0-7, but represented as a-h
    this.rankIndex = rankIndex; // stored as 0-7, but represented as 1-8
    this.control = control;
    this.hasMoved = false;

    this.htmlElement = this.generateHtmlElement();

    this.initializeEventListners();

    this.possibleMoves = this.getPossibleMoves();
    this.possibleMoves = { possibleMoves: [], capturablePieces: [] };
    this.canAttackOponentKing = false;
  }

  /**
   * Returns the oponent's king
   *
   * @returns {King} - the oponent's king
   */
  get oponentsKing(): King | undefined {
    if (!this.control) return;
    return this.control.state.getPlayersKing(!this.isWhite);
  }

  /**
   * Returns whether it is white's turn.
   */
  get isWhitesTurn(): boolean | undefined {
    if (!this.control) return;
    return this.control.state.isWhitesTurn;
  }

  /**
   * Returns whether the game is player vs player
   */
  get isPlayerVsPlayer(): boolean | undefined {
    if (!this.control) return;
    return this.control.state.isPlayerVsPlayer;
  }

  /**
   * Recalculates the piece's possible moves
   * For use when the board state changes
   */
  reEvaluateMoves() {
    this.possibleMoves = this.getPossibleMoves();

    const { capturablePieces } = this.possibleMoves;
    this.canAttackOponentKing = capturablePieces.some(
      (move) =>
        move[0] === this.oponentsKing?.fileIndex &&
        move[1] === this.oponentsKing?.rankIndex
    );
  }

  /**
   * Recalculates the piece's special moves
   * For use when the board state changes
   * It must be reevaluated after the completion of evaluation moves of all pieces
   * @example castling for the king, which requires the evaluation of other pieces' moves whether they are checking the castling path or not
   */
  reEvaluateSpecialMoves() {
    this.addPossibleSpecialMoves();
  }

  /**
   * Adds a move to the possible moves array if it is within the bounds of the board.
   * Also adds the move to the capturable moves array if there is an oponent's piece on the square.
   *
   * @param {number[][]} possibleMoves
   * @param {number[][]} capturablePieces
   * @param {number} fileIndex
   * @param {number} rankIndex
   *
   * @returns {boolean} - true if should continue, false if should break
   */
  _addToPossibleAndCapturableMoves(
    possibleMoves: number[][],
    capturablePieces: number[][],
    fileIndex: number,
    rankIndex: number
  ): boolean {
    if (!this.control) return false;

    return addToPossibleAndCapturableMoves(
      this.control,
      possibleMoves,
      capturablePieces,
      fileIndex,
      rankIndex,
      this.isWhite
    );
  }

  /**
   * Returns possible moves across an axis
   *
   * @param x x-axis direction, 1 for positive, -1 for negative
   * @param y y-axis direction, 1 for positive, -1 for negative
   *
   * @returns - object containing possible moves and capturable pieces
   */
  getPossibleMovesAcrossAxis(
    x: 1 | 0 | -1,
    y: 1 | 0 | -1
  ): PossibleMovesResult {
    const possibleMoves: Moves = [];
    const capturablePieces: Moves = [];

    if (x === 0 && y === 0) return { possibleMoves, capturablePieces };

    if (x === 0) {
      for (let i = this.rankIndex + y; i < RANKS_LENGTH && i >= 0; i += y) {
        const shouldContinue = this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePieces,
          this.fileIndex,
          i
        );
        if (!shouldContinue) break;
      }
      return { possibleMoves, capturablePieces };
    } else if (y === 0) {
      for (let i = this.fileIndex + x; i < FILES_LENGTH && i >= 0; i += x) {
        const shouldContinue = this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePieces,
          i,
          this.rankIndex
        );
        if (!shouldContinue) break;
      }
      return { possibleMoves, capturablePieces };
    } else {
      for (
        let i = this.fileIndex + x, j = this.rankIndex + y;
        i < FILES_LENGTH && i >= 0 && j < RANKS_LENGTH && j >= 0;
        i += x, j += y
      ) {
        const shouldContinue = this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePieces,
          i,
          j
        );
        if (!shouldContinue) break;
      }
      return { possibleMoves, capturablePieces };
    }
  }

  /**
   * Returns possible moves across both axes, i.e. x and y
   *
   * @returns {PossibleMovesResult} - object containing possible moves and capturable pieces
   */
  getPossibleMovesAcrossAxes(): PossibleMovesResult {
    const possibleMoves = [];
    const capturablePieces = [];

    // Across +x axis
    const {
      possibleMoves: possibleMovesAcrossPXAxis,
      capturablePieces: capturablePiecesAcrossPXAxis,
    } = this.getPossibleMovesAcrossAxis(1, 0);
    possibleMoves.push(...possibleMovesAcrossPXAxis);
    capturablePieces.push(...capturablePiecesAcrossPXAxis);

    // Across -x axis
    const {
      possibleMoves: possibleMovesAcrossNXAxis,
      capturablePieces: capturablePiecesAcrossNXAxis,
    } = this.getPossibleMovesAcrossAxis(-1, 0);
    possibleMoves.push(...possibleMovesAcrossNXAxis);
    capturablePieces.push(...capturablePiecesAcrossNXAxis);

    // Across +y axis
    const {
      possibleMoves: possibleMovesAcrossPYAxis,
      capturablePieces: capturablePiecesAcrossPYAxis,
    } = this.getPossibleMovesAcrossAxis(0, 1);
    possibleMoves.push(...possibleMovesAcrossPYAxis);
    capturablePieces.push(...capturablePiecesAcrossPYAxis);

    // Across -y axis
    const {
      possibleMoves: possibleMovesAcrossPNAxis,
      capturablePieces: capturablePiecesAcrossPNAxis,
    } = this.getPossibleMovesAcrossAxis(0, -1);
    possibleMoves.push(...possibleMovesAcrossPNAxis);
    capturablePieces.push(...capturablePiecesAcrossPNAxis);

    return { possibleMoves, capturablePieces };
  }

  /**
   * Returns possible moves across all diagonals, i.e. xy, x-y, -x-y, -xy
   *
   * @returns {PossibleMovesResult} - object containing possible moves and capturable pieces
   */
  getPossibleMovesAcrossAllDiagonals(): PossibleMovesResult {
    const possibleMoves = [];
    const capturablePieces = [];

    // Across xy diagonal
    const {
      possibleMoves: possibleMovesAcrossPXPYDiagonal,
      capturablePieces: capturablePiecesAcrossPXPYDiagonal,
    } = this.getPossibleMovesAcrossAxis(1, 1);
    possibleMoves.push(...possibleMovesAcrossPXPYDiagonal);
    capturablePieces.push(...capturablePiecesAcrossPXPYDiagonal);

    // Across x-y diagonal
    const {
      possibleMoves: possibleMovesAcrossPXNYDiagonal,
      capturablePieces: capturablePiecesAcrossPXNYDiagonal,
    } = this.getPossibleMovesAcrossAxis(1, -1);
    possibleMoves.push(...possibleMovesAcrossPXNYDiagonal);
    capturablePieces.push(...capturablePiecesAcrossPXNYDiagonal);

    // Across -x-y diagonal
    const {
      possibleMoves: possibleMovesAcrossNXNYDiagonal,
      capturablePieces: capturablePiecesAcrossNXNYDiagonal,
    } = this.getPossibleMovesAcrossAxis(-1, -1);
    possibleMoves.push(...possibleMovesAcrossNXNYDiagonal);
    capturablePieces.push(...capturablePiecesAcrossNXNYDiagonal);

    // Across -xy diagonal
    const {
      possibleMoves: possibleMovesAcrossNXPYDiagonal,
      capturablePieces: capturablePiecesAcrossNXPYDiagonal,
    } = this.getPossibleMovesAcrossAxis(-1, 1);
    possibleMoves.push(...possibleMovesAcrossNXPYDiagonal);
    capturablePieces.push(...capturablePiecesAcrossNXPYDiagonal);

    return { possibleMoves, capturablePieces };
  }

  /**
   * Returns all possible moves for the piece
   *
   * @returns {PossibleMovesResult} - object containing possible moves and capturable pieces
   */
  getPossibleMoves(): PossibleMovesResult {
    return { possibleMoves: [], capturablePieces: [] };
  }

  /**
   * Adds possible special moves to the piece's possible moves
   * @example castling for the king
   */
  addPossibleSpecialMoves() {}

  /**
   * Generate the piece's html elemen
   */
  generateHtmlElement(): HTMLElement {
    if (this.htmlElement) return this.htmlElement;

    const piece = document.createElement('img');
    const fileName = `${this.isWhite ? 'w' : 'b'}${this.abbreviation}`;
    piece.src = `/images/${fileName}.png`;
    piece.alt = `${this.isWhite ? 'White' : 'Black'} ${this.name}`;
    piece.classList.add('chess-board__piece');
    piece.setAttribute('data-piece', fileName);

    return piece;
  }

  /**
   * Returns the piece's html element
   *
   * @returns {HTMLElement} - the piece's html element
   */
  getHtmlElement(): HTMLElement {
    return this.htmlElement;
  }

  /**
   * Flips the piece
   */
  flip() {
    this.htmlElement.classList.toggle('chess-board__piece--reverse');
  }

  /**
   * Fixes the piece's orientation
   */
  fixPieceOrientation() {
    if (this.isWhitesTurn || !this.isPlayerVsPlayer) {
      this.htmlElement.classList.remove('chess-board__piece--reverse');
    } else {
      this.htmlElement.classList.add('chess-board__piece--reverse');
    }
  }

  /**
   * Removes all highlights from the piece
   */
  _removeAllHighlights() {
    for (const modifier of SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS) {
      this.removeHighlight(modifier);
    }
  }

  /**
   * Highlights a piece on the board.
   *
   * @param modifier The modifier to add to the class name.
   */
  highlight(modifier: PieceHighlightModifiers) {
    if (!SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.add(`chess-board__piece--${modifier}`);
  }

  /**
   * Removes a highlight styling from a piece on the board.
   *
   * @param modifier The modifier to add to the class name.
   */
  removeHighlight(modifier: PieceHighlightModifiers) {
    if (!SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.remove(`chess-board__piece--${modifier}`);
  }

  /**
   * Resets the piece's position to the specified square
   *
   * @param {number} fileIndex - index of the file to reset to
   * @param {number} rankIndex - index of the rank to reset to
   */
  _resetAt(fileIndex: number, rankIndex: number) {
    this.fileIndex = fileIndex;
    this.rankIndex = rankIndex;
    this.hasMoved = false;

    this.reEvaluateMoves();
  }

  /**
   * Resets the piece's position to the specified square and fixes its orientation
   * Also removes all highlights from the piece
   *
   * @param {number} fileIndex - index of the file to reset to
   * @param {number} rankIndex - index of the rank to reset to
   */
  handleResetAt(fileIndex: number, rankIndex: number) {
    this._resetAt(fileIndex, rankIndex);
    this.fixPieceOrientation();
    this._removeAllHighlights();
  }

  /**
   * Moves the piece to the specified square
   *
   * @param {number} fileIndex - index of the file to move to
   * @param {number} rankIndex - index of the rank to move to
   */
  moveTo(fileIndex: number, rankIndex: number) {
    this.fileIndex = fileIndex;
    this.rankIndex = rankIndex;

    if (!this.hasMoved) this.hasMoved = true;

    this.reEvaluateMoves();
  }

  /**
   * Removes the piece from the board
   *
   * @returns {Piece} - the piece that was removed
   */
  remove(): Piece {
    this.htmlElement.remove();
    return this;
  }

  /**
   * Sets the piece's control
   *
   * @param {GameControl} control - the piece's control
   */
  setControl(control: GameControl) {
    this.control = control;
  }

  /**
   * Initializes event listeners for a piece.
   */
  initializeEventListners() {
    const pieceElement = this.getHtmlElement();

    pieceElement.addEventListener('click', () => {
      this.control?.handlePieceClickOrDrag(this);
    });
    pieceElement.addEventListener('dragstart', () => {
      this.control?.handlePieceClickOrDrag(this);
    });
  }
}
