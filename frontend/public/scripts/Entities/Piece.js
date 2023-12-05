// Abstract class for all pieces
class Piece {
  /**
   * Creates a piece
   *
   * @param {string} name - name of the piece
   * @param {boolean} isWhite - true if the piece is white, false if black
   * @param {number} fileIndex - index of the file the piece is on
   * @param {number} rankIndex - index of the rank the piece is on
   */
  constructor(name, isWhite, fileIndex, rankIndex) {
    this.name = name;
    this.abbreviation = name[0].toUpperCase();
    this.isWhite = isWhite;
    this.fileIndex = fileIndex; // stored as 0-7, but represented as a-h
    this.rankIndex = rankIndex; // stored as 0-7, but represented as 1-8
  }

  /**
   * Returns all possible moves for the piece
   *
   * @returns {number[][]} - array of all possible moves for the piece
   */
  getPossibleMoves() {}
}

class Pawn extends Piece {
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

class Rook extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Rook", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {}
}

class Knight extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Knight", isWhite, fileIndex, rankIndex);
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

class Bishop extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Bishop", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {}
}

class Queen extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Queen", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {}
}

class King extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("King", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {}
}
