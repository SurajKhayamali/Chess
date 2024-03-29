import { log } from 'scripts/utils';
import { Piece, PieceConstructorArgsWithoutName } from './Piece';
import { getCastlingMovesIfPossible } from './helpers/specialMoves';
import { PieceHighlightModifiers, PieceType } from 'enums/game.enum';

export class King extends Piece {
  isInCheck: boolean;

  constructor(...args: PieceConstructorArgsWithoutName) {
    super(PieceType.KING, ...args);
    this.isInCheck = false;
  }

  getPossibleMoves() {
    const possibleMoves: number[][] = [];
    const capturablePieces: number[][] = [];

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

  /**
   * Adds the square at the specified file and rank index to the possible moves for castling.
   */
  addPossibleSpecialMoves() {
    if (!this.control) return;

    const castlingMovesIfPossible = getCastlingMovesIfPossible(
      this.control.state,
      this
    );
    log('castlingMovesIfPossible:', castlingMovesIfPossible);
    for (const castlingMove of castlingMovesIfPossible) {
      this.possibleMoves.possibleMoves.push(castlingMove);
    }
  }

  /**
   * Updates the isInCheck property and highlights the piece if it is in check.
   *
   * @param isInCheck Whether the piece is in check.
   */
  updateIsInCheck(isInCheck: boolean) {
    if (isInCheck) {
      this.highlight(PieceHighlightModifiers.CHECKED);
    } else {
      this.removeHighlight(PieceHighlightModifiers.CHECKED);
    }
    this.isInCheck = isInCheck;
  }

  /**
   * Returns whether the square at the specified file and rank index is under attack by an enemy piece.
   *
   * @param fileIndex The file index of the square.
   * @param rankIndex The rank index of the square.
   *
   * @returns Whether the square at the specified file and rank index is under attack by an enemy piece.
   *
   * @usage This method is used on the castling path squares to check if any are under attack.
   */
  isSquareOccupiedOrUnderAttack(fileIndex: number, rankIndex: number) {
    if (!this.control) return false;

    return this.control.state.isSquareOccupiedOrUnderAttack(
      fileIndex,
      rankIndex,
      this.isWhite
    );
  }

  /**
   * Returns whether the square at the specified file and rank index is under attack by an enemy piece.
   *
   * @param fileIndex The file index of the square.
   * @param rankIndex The rank index of the square.
   *
   * @returns Whether the square at the specified file and rank index is under attack by an enemy piece.
   *
   * @usage This method is used on the king's square to check if the king is in check.
   */
  isSquareUnderAttack(fileIndex: number, rankIndex: number) {
    if (!this.control) return false;

    return this.control.state.isSquareUnderAttack(
      fileIndex,
      rankIndex,
      this.isWhite
    );
  }
}
