import { Piece } from "./Piece";
import {
  addToPossibleAndCapturableMoves,
  addToPossibleAndCapturableMovesForPawn,
  getRankIndexIncrement,
} from "./helpers/common.helper";

export class Pawn extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Pawn", isWhite, fileIndex, rankIndex);
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePieces = [];

    const rankIndexIncrement = getRankIndexIncrement(this.isWhite);

    const shouldContinue = addToPossibleAndCapturableMovesForPawn(
      this.control,
      possibleMoves,
      capturablePieces,
      this.fileIndex,
      this.rankIndex + rankIndexIncrement,
      this.isWhite
    );

    if (shouldContinue && !this.hasMoved) {
      addToPossibleAndCapturableMoves(
        this.control,
        possibleMoves,
        [], // pieces should not be capturable when moving two squares ahead
        this.fileIndex,
        this.rankIndex + rankIndexIncrement * 2,
        this.isWhite
      );
    }

    // Detect if en passant is possible in the current move
    const enPassantAvailableAt = this.control.getEnPassantAvailableAt();
    if (enPassantAvailableAt) {
      capturablePieces.push([
        enPassantAvailableAt.fileIndex,
        enPassantAvailableAt.rankIndex,
      ]);
    }

    return { possibleMoves, capturablePieces };
  }
}
