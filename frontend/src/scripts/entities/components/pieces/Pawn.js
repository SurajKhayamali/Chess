import { PIECES } from "../../../constants/constants";
import { Piece } from "./Piece";
import { Queen } from "./Queen";
import {
  addToPossibleAndCapturableMoves,
  addToPossibleAndCapturableMovesForPawn,
  getRankIndexIncrement,
} from "./helpers/common.helper";

export class Pawn extends Piece {
  constructor(...args) {
    super(PIECES.PAWN, ...args);
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

  /**
   * Promotes the pawn to the specified piece type.
   *
   * @param {string} pieceType
   *
   * @returns {Piece} The promoted piece.
   */
  promoteTo(pieceType) {
    const args = [this.isWhite, this.fileIndex, this.rankIndex, this.control];
    switch (pieceType) {
      case PIECES.QUEEN.abbreviation:
        return new Queen(...args);
      case PIECES.ROOK.abbreviation:
        return new Rook(...args);
      case PIECES.BISHOP:
        return new Bishop(...args);
      case PIECES.KNIGHT:
        return new Knight(...args);
      default:
        throw new Error("Invalid piece type");
    }
  }
}
