import { Piece } from "./Piece";

export class Bishop extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Bishop", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAllDiagonals();
  }
}
