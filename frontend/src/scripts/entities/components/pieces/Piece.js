import {
  FILES_LENGTH,
  RANKS_LENGTH,
  SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS,
} from "../../../constants/constants";
import { addToPossibleMoves, cloneDeep } from "../../../utils";

/**
 * object containing possible moves and capturable pieces
 *
 * @typedef {Object} PossibleMovesResult
 *
 * @property {number[][]} possibleMoves
 * @property {number[][]} capturablePieces
 */

/**
 * Abstract class for all pieces
 * @abstract exporting for type annotation in jsdoc only
 */
export class Piece {
  /**
   * Creates a piece
   *
   * @param {string} name - name of the piece
   * @param {boolean} isWhite - true if the piece is white, false if black
   * @param {number} fileIndex - index of the file the piece is on
   * @param {number} rankIndex - index of the rank the piece is on
   * @param {string} [abbreviation] - abbreviation of the piece, optional
   */
  constructor(name, isWhite, fileIndex, rankIndex, abbreviation) {
    this.name = name;
    this.abbreviation = abbreviation || name?.[0]?.toUpperCase();
    this.isWhite = isWhite;
    this.fileIndex = fileIndex; // stored as 0-7, but represented as a-h
    this.rankIndex = rankIndex; // stored as 0-7, but represented as 1-8

    this.htmlElement = this.generateHtmlElement();
    this.control = null;

    this.initializeEventListners();
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
    possibleMoves,
    capturablePieces,
    fileIndex,
    rankIndex
  ) {
    const existingPiece = this.control.getPiecesOnSquare(fileIndex, rankIndex);

    // If there is a piece on the square
    if (!existingPiece) {
      addToPossibleMoves(possibleMoves, fileIndex, rankIndex);
      return true;
    }

    // If it is different color, add to capturable pieces
    if (existingPiece.isWhite !== this.isWhite)
      addToPossibleMoves(capturablePieces, fileIndex, rankIndex);

    return false;
  }

  /**
   * Returns possible moves across an axis
   *
   * @param {1 | -1} x x-axis direction, 1 for positive, -1 for negative
   * @param {1 | -1} y y-axis direction, 1 for positive, -1 for negative
   *
   * @returns {PossibleMovesResult} - object containing possible moves and capturable pieces
   */
  getPossibleMovesAcrossAxis(x, y) {
    const possibleMoves = [];
    const capturablePieces = [];

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
  getPossibleMovesAcrossAxes() {
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
  getPossibleMovesAcrossAllDiagonals() {
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
  getPossibleMoves() {}

  /**
   * Generate the piece's html element
   *
   * @returns {HTMLElement} - the piece's html element
   */
  generateHtmlElement() {
    if (this.htmlElement) return this.htmlElement;

    const piece = document.createElement("img");
    const fileName = `${this.isWhite ? "w" : "b"}${this.abbreviation}`;
    piece.src = `/images/${fileName}.png`;
    piece.alt = `${this.isWhite ? "White" : "Black"} ${this.name}`;
    piece.classList.add("chess-board__piece");
    piece.setAttribute("data-piece", fileName);

    return piece;
  }

  /**
   * Returns the piece's html element
   *
   * @returns {HTMLElement} - the piece's html element
   */
  getHtmlElement() {
    return this.htmlElement;
  }

  /**
   * Flips the piece
   */
  flip() {
    this.htmlElement.classList.toggle("chess-board__piece--reverse");
  }

  /**
   * Highlights a piece on the board.
   *
   * @param {"checked"} modifier The modifier to add to the class name.
   */
  highlight(modifier) {
    if (!SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.add(`chess-board__piece--${modifier}`);
  }

  /**
   * Removes a highlight styling from a piece on the board.
   *
   * @param {"checked"} modifier The modifier to add to the class name.
   */
  removeHighlight(modifier) {
    if (!SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.remove(`chess-board__piece--${modifier}`);
  }

  /**
   * Moves the piece to the specified square
   *
   * @param {number} fileIndex - index of the file to move to
   * @param {number} rankIndex - index of the rank to move to
   */
  moveTo(fileIndex, rankIndex) {
    this.fileIndex = fileIndex;
    this.rankIndex = rankIndex;
  }

  /**
   * Removes the piece from the board
   *
   * @returns {Piece} - the piece that was removed
   */
  remove() {
    this.htmlElement.remove();
    return this;
  }

  /**
   * Sets the piece's control
   *
   * @param {GameControl} control - the piece's control
   */
  setControl(control) {
    this.control = control;
  }

  /**
   * Initializes event listeners for a piece.
   */
  initializeEventListners() {
    const pieceElement = this.getHtmlElement();

    pieceElement.addEventListener("click", () => {
      this.control.handlePieceClickOrDrag(this);
    });
    pieceElement.addEventListener("dragstart", () => {
      this.control.handlePieceClickOrDrag(this);
    });
  }

  clone() {
    const clonePiece = new Piece(
      this.name,
      this.isWhite,
      this.fileIndex,
      this.rankIndex,
      this.abbreviation
    );

    // clonePiece.htmlElement = this.htmlElement;
    clonePiece.control = this.control;
  }
}
