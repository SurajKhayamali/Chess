import { log } from "../../../utils";
import { Piece } from "./Piece";
import { getCastlingMovesIfPossible } from "./helpers/specialMoves";

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

    const castlingMovesIfPossible = getCastlingMovesIfPossible(
      this.control.state,
      this
    );
    log("castlingMovesIfPossible:", castlingMovesIfPossible);
    for (const castlingMove of castlingMovesIfPossible) {
      possibleMoves.push(castlingMove);
    }

    return { possibleMoves, capturablePieces };
  }

  updateIsInCheck(isInCheck) {
    this.isInCheck = isInCheck;
  }

  /**
   * Returns whether the square at the specified file and rank index is under attack by an enemy piece.
   *
   * @param {number} fileIndex The file index of the square.
   * @param {number} rankIndex The rank index of the square.
   *
   * @returns {boolean} Whether the square at the specified file and rank index is under attack by an enemy piece.
   */
  isSquareOccupiedOrUnderAttack(fileIndex, rankIndex) {
    return this.control.state.isSquareOccupiedOrUnderAttack(
      fileIndex,
      rankIndex,
      this.isWhite
    );
  }
}
