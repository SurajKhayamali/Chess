import { log } from "../../../utils";
import { Piece } from "./Piece";
import { getCastlingMoveIfPossible } from "./helpers/specialMoves.helper";

export class King extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("King", isWhite, fileIndex, rankIndex);
    this.isInCheck = false;

    this.hasMoved = false; // for castling
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

    console.log("possibleMoves:", possibleMoves);
    const castlingMovesIfPossible = getCastlingMoveIfPossible(
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

  updateHasMoved() {
    this.hasMoved = true;
  }

  /**
   * Returns whether the square at the specified file and rank index is under attack by an enemy piece.
   *
   * @param {number} fileIndex The file index of the square.
   * @param {number} rankIndex The rank index of the square.
   *
   * @returns {boolean} Whether the square at the specified file and rank index is under attack by an enemy piece.
   */
  isSquareUnderAttack(fileIndex, rankIndex) {
    return this.control.state.isSquareUnderAttack(fileIndex, rankIndex);
  }
}
