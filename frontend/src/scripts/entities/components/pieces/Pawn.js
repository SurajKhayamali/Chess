import { Piece } from "./Piece";

export class Pawn extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Pawn", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePieces = [];

    if (this.isWhite) {
      if (this.rankIndex == 1) {
        this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePieces,
          this.fileIndex,
          this.rankIndex + 2
        );
      }

      this._addToPossibleAndCapturableMoves(
        possibleMoves,
        capturablePieces,
        this.fileIndex,
        this.rankIndex + 1
      );
    } else {
      if (this.rankIndex == 6) {
        this._addToPossibleAndCapturableMoves(
          possibleMoves,
          capturablePieces,
          this.fileIndex,
          this.rankIndex - 2
        );
      }

      this._addToPossibleAndCapturableMoves(
        possibleMoves,
        capturablePieces,
        this.fileIndex,
        this.rankIndex - 1
      );
    }
    return { possibleMoves, capturablePieces };
  }
}
