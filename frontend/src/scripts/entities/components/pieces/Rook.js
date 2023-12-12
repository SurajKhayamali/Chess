import { Piece } from "./Piece";

export class Rook extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Rook", isWhite, fileIndex, rankIndex);

    this.hasMoved = false; // for castling
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAxes();
  }

  updateHasMoved() {
    this.hasMoved = true;
  }
}
