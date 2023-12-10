import { FILES_LENGTH, RANKS_LENGTH } from "../../constants/constants";
import { addToPossibleMoves } from "../../utils";

// Abstract class for all pieces
class Piece {
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
   * @param {number[][]} capturablePiece
   * @param {number} fileIndex
   * @param {number} rankIndex
   *
   * @returns {boolean} - true if should continue, false if should break
   */
  _addToPossibleAndCapturableMoves(
    possibleMoves,
    capturablePiece,
    fileIndex,
    rankIndex
  ) {
    const existingPiece = this.control.getPiecesOnSquare(fileIndex, rankIndex);
    if (!existingPiece) {
      addToPossibleMoves(possibleMoves, fileIndex, rankIndex);
      return true;
    }

    if (existingPiece.isWhite !== this.isWhite)
      addToPossibleMoves(capturablePiece, fileIndex, rankIndex);

    return false;
  }

  /**
   * Returns possible moves across an axis
   *
   * @param {1 | -1} x x-axis direction, 1 for positive, -1 for negative
   * @param {1 | -1} y y-axis direction, 1 for positive, -1 for negative
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMovesAcrossAxis(x, y) {
    const possibleMoves = [];
    const capturablePiece = [];

    if (x === 0 && y === 0) return possibleMoves;

    if (x === 0) {
      for (let i = this.rankIndex + y; i < RANKS_LENGTH && i >= 0; i += y) {
        const shouldContinue = this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePiece,
          this.fileIndex,
          i
        );
        if (!shouldContinue) break;
      }
      return possibleMoves;
    } else if (y === 0) {
      for (let i = this.fileIndex + x; i < FILES_LENGTH && i >= 0; i += x) {
        const shouldContinue = this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePiece,
          i,
          this.rankIndex
        );
        if (!shouldContinue) break;
      }
      return possibleMoves;
    } else {
      for (
        let i = this.fileIndex + x, j = this.rankIndex + y;
        i < FILES_LENGTH && i >= 0 && j < RANKS_LENGTH && j >= 0;
        i += x, j += y
      ) {
        const shouldContinue = this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePiece,
          i,
          j
        );
        if (!shouldContinue) break;
      }
      return possibleMoves;
    }
  }

  /**
   * Returns possible moves across both axes, i.e. x and y
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMovesAcrossAxes() {
    const possibleMoves = [];

    // Across +x axis
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(1, 0));
    // Across -x axis
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(-1, 0));
    // Across +y axis
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(0, 1));
    // Across -y axis
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(0, -1));

    return possibleMoves;
  }

  /**
   * Returns possible moves across all diagonals, i.e. xy, x-y, -x-y, -xy
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMovesAcrossAllDiagonals() {
    const possibleMoves = [];

    // Across xy diagonal
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(1, 1));
    // Across x-y diagonal
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(1, -1));
    // Across -x-y diagonal
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(-1, -1));
    // Across -xy diagonal
    possibleMoves.push(...this.getPossibleMovesAcrossAxis(-1, 1));

    return possibleMoves;
  }

  /**
   * Returns all possible moves for the piece
   *
   * @returns {number[][]} - array of all possible moves for the piece
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
}

export class Pawn extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Pawn", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePiece = [];

    if (this.isWhite) {
      if (this.rankIndex == 1) {
        this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePiece,
          this.fileIndex,
          this.rankIndex + 2
        );
      }

      this._addToPossibleAndCapturableMoves(
        possibleMoves,
        capturablePiece,
        this.fileIndex,
        this.rankIndex + 1
      );
    } else {
      if (this.rankIndex == 6) {
        this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePiece,
          this.fileIndex,
          this.rankIndex - 2
        );
      }

      this._addToPossibleAndCapturableMoves(
        possibleMoves,
        capturablePiece,
        this.fileIndex,
        this.rankIndex - 1
      );
    }
    return possibleMoves;
  }
}

export class Rook extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Rook", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAxes();
  }
}

export class Knight extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Knight", isWhite, fileIndex, rankIndex, "N");
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePiece = [];
    const moveOffsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const moveOffset of moveOffsets) {
      const [fileOffset, rankOffset] = moveOffset;

      this._addToPossibleAndCapturableMoves(
        possibleMoves,
        capturablePiece,
        this.fileIndex + fileOffset,
        this.rankIndex + rankOffset
      );
    }

    return possibleMoves;
  }
}

export class Bishop extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Bishop", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAllDiagonals();
  }
}

export class Queen extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Queen", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    const possibleMoves = [];

    possibleMoves.push(...this.getPossibleMovesAcrossAxes());
    possibleMoves.push(...this.getPossibleMovesAcrossAllDiagonals());
    return possibleMoves;
  }
}

export class King extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("King", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePiece = [];

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex,
      this.rankIndex + 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex,
      this.rankIndex - 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex + 1,
      this.rankIndex
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex - 1,
      this.rankIndex
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex + 1,
      this.rankIndex + 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex - 1,
      this.rankIndex - 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex + 1,
      this.rankIndex - 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePiece,
      this.fileIndex - 1,
      this.rankIndex + 1
    );

    return possibleMoves;
  }
}
