import { Piece } from "./Piece";

export class Rook extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Rook", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAxes();
  }
}
