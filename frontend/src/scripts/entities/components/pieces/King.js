import { Piece } from "./Piece";

export class King extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("King", isWhite, fileIndex, rankIndex);
    this.isInCheck = false;
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePieces = [];

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex,
      this.rankIndex + 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex,
      this.rankIndex - 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex + 1,
      this.rankIndex
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex - 1,
      this.rankIndex
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex + 1,
      this.rankIndex + 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex - 1,
      this.rankIndex - 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex + 1,
      this.rankIndex - 1
    );

    this._addToPossibleAndCapturableMoves(
      possibleMoves,
      capturablePieces,
      this.fileIndex - 1,
      this.rankIndex + 1
    );

    return { possibleMoves, capturablePieces };
  }

  updateIsInCheck(isInCheck) {
    this.isInCheck = isInCheck;
  }
}
