import { PieceType } from '../../enums/game.enum';
import { Piece, PieceConstructorArgsWithoutName } from './Piece';
import { Queen } from './Queen';
import { Rook } from './Rook';
import { Bishop } from './Bishop';
import { Knight } from './Knight';
import {
  addToPossibleAndCapturableMoves,
  addToPossibleAndCapturableMovesForPawn,
  getRankIndexIncrement,
} from './helpers/common.helper';
import { Moves } from '../../interfaces/game.interface';

export class Pawn extends Piece {
  constructor(...args: PieceConstructorArgsWithoutName) {
    super(PieceType.PAWN, ...args);
  }

  getPossibleMoves() {
    const possibleMoves: Moves = [];
    const capturablePieces: Moves = [];

    if (!this.control) return { possibleMoves, capturablePieces };

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
    const enPassantAvailableAt = this.control?.getEnPassantAvailableAt();
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
   * @param pieceType
   *
   * @returns The promoted piece.
   */
  promoteTo(pieceType: PieceType) {
    const args: PieceConstructorArgsWithoutName = [
      this.isWhite,
      this.fileIndex,
      this.rankIndex,
      this.control,
      pieceType,
    ];
    switch (pieceType) {
      case PieceType.QUEEN:
        return new Queen(...args);
      case PieceType.ROOK:
        return new Rook(...args);
      case PieceType.BISHOP:
        return new Bishop(...args);
      case PieceType.KNIGHT:
        return new Knight(...args);
      default:
        throw new Error('Invalid piece type');
    }
  }
}
