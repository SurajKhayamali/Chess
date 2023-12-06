import { addToPossibleMoves } from "../utils";

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
  }

  /**
   * Returns possible moves across both axes
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMovesAcrossAxes() {
    const possibleMoves = [];

    for (let i = 0; i < 8; i++) {
      if (i !== this.fileIndex)
        addToPossibleMoves(possibleMoves, i, this.rankIndex);

      if (i !== this.rankIndex)
        addToPossibleMoves(possibleMoves, this.fileIndex, i);
    }

    return possibleMoves;
  }

  /**
   * Returns possible moves across a diagonals
   *
   * @param {number} i itteration index
   * @param {1 | -1} x x-axis direction, 1 for positive, -1 for negative
   * @param {1 | -1} y y-axis direction, 1 for positive, -1 for negative
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMovesAcrossDiagonals(i, x, y) {
    const possibleMoves = [];
    const fileOffset = this.fileIndex + i * x;
    const rankOffset = this.rankIndex + i * y;

    if (fileOffset !== this.fileIndex && rankOffset !== this.rankIndex)
      addToPossibleMoves(possibleMoves, fileOffset, rankOffset);

    return possibleMoves;
  }

  /**
   * Returns possible moves across all diagonals
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMovesAcrossAllDiagonals() {
    const possibleMoves = [];

    for (let i = 0; i < 8; i++) {
      // Across xy diagonal
      possibleMoves.push(...this.getPossibleMovesAcrossDiagonals(i, 1, 1));

      // Across x-y diagonal
      possibleMoves.push(...this.getPossibleMovesAcrossDiagonals(i, 1, -1));

      // Across -x-y diagonal
      possibleMoves.push(...this.getPossibleMovesAcrossDiagonals(i, -1, -1));

      // Across -xy diagonal
      possibleMoves.push(...this.getPossibleMovesAcrossDiagonals(i, -1, 1));
    }

    return possibleMoves;
  }

  /**
   * Returns all possible moves for the piece
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMoves() {}

  /**
   * Returns the piece's html element
   * @returns {HTMLElement} - the piece's html element
   */
  getHtmlElement() {
    const piece = document.createElement("img");
    const fileName = `${this.isWhite ? "w" : "b"}${this.abbreviation}`;
    piece.src = `/images/${fileName}.png`;
    piece.alt = `${this.isWhite ? "White" : "Black"} ${this.name}`;
    piece.classList.add("chess-board__piece");
    piece.setAttribute("data-piece", fileName);
    return piece;
  }
}

export class Pawn extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Pawn", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    const possibleMoves = [];

    if (this.isWhite) {
      if (this.rankIndex == 1) {
        addToPossibleMoves(possibleMoves, this.fileIndex, this.rankIndex + 2);
      }
      addToPossibleMoves(possibleMoves, this.fileIndex, this.rankIndex + 1);
    } else {
      if (this.rankIndex == 6) {
        addToPossibleMoves(possibleMoves, this.fileIndex, this.rankIndex - 2);
      }
      addToPossibleMoves(possibleMoves, this.fileIndex, this.rankIndex - 1);
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

      addToPossibleMoves(
        possibleMoves,
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

    addToPossibleMoves(possibleMoves, this.fileIndex, this.rankIndex + 1);
    addToPossibleMoves(possibleMoves, this.fileIndex, this.rankIndex - 1);
    addToPossibleMoves(possibleMoves, this.fileIndex + 1, this.rankIndex);
    addToPossibleMoves(possibleMoves, this.fileIndex - 1, this.rankIndex);
    addToPossibleMoves(possibleMoves, this.fileIndex + 1, this.rankIndex + 1);
    addToPossibleMoves(possibleMoves, this.fileIndex - 1, this.rankIndex - 1);
    addToPossibleMoves(possibleMoves, this.fileIndex + 1, this.rankIndex - 1);
    addToPossibleMoves(possibleMoves, this.fileIndex - 1, this.rankIndex + 1);

    return possibleMoves;
  }
}
