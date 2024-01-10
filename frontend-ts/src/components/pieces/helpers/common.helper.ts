import { GameControl } from 'entities/GameControl';
import { Moves } from 'interfaces/game.interface';
import {
  checkFileIndexOutOfBounds,
  checkRankIndexOutOfBounds,
} from 'scripts/utils';

/**
 * Adds a move to the possible moves array if it is within the bounds of the board.
 *
 * @param possibleMoves
 * @param fileIndex
 * @param rankIndex
 */
export function addToPossibleMoves(
  possibleMoves: Moves,
  fileIndex: number,
  rankIndex: number
) {
  if (
    checkFileIndexOutOfBounds(fileIndex) ||
    checkRankIndexOutOfBounds(rankIndex)
  )
    return;

  possibleMoves.push([fileIndex, rankIndex]);
}

/**
 * Adds a move to the possible moves array if it is within the bounds of the board.
 * Also adds the move to the capturable moves array if there is an oponent's piece on the square.
 *
 * @param control
 * @param possibleMoves
 * @param capturablePieces
 * @param fileIndex
 * @param rankIndex
 * @param isWhite
 *
 * @returns - true if should continue, false if should break
 */
export function addToPossibleAndCapturableMoves(
  control: GameControl,
  possibleMoves: Moves,
  capturablePieces: Moves,
  fileIndex: number,
  rankIndex: number,
  isWhite: boolean
) {
  const existingPiece = control?.getPiecesOnSquare(fileIndex, rankIndex);

  // If there is a piece on the square
  if (!existingPiece) {
    addToPossibleMoves(possibleMoves, fileIndex, rankIndex);
    return true;
  }

  // If it is different color, add to capturable pieces
  if (existingPiece.isWhite !== isWhite)
    addToPossibleMoves(capturablePieces, fileIndex, rankIndex);

  return false;
}

/**
 * Adds a move to the possible moves array if it is within the bounds of the board.
 * Also adds the move to the capturable moves array if there is an oponent's piece on the square.
 * This function is specific to the Pawn piece.
 * It handles the special case of the pawn capturing a piece diagonally.
 *
 * @param control
 * @param possibleMoves
 * @param capturablePieces
 * @param fileIndex
 * @param rankIndex
 * @param isWhite
 *
 * @returns {boolean} - true if should continue, false if should break
 */
export function addToPossibleAndCapturableMovesForPawn(
  control: GameControl,
  possibleMoves: Moves,
  capturablePieces: Moves,
  fileIndex: number,
  rankIndex: number,
  isWhite: boolean
) {
  const existingPieceAtLeft = control?.getPiecesOnSquare(
    fileIndex - 1,
    rankIndex
  );
  if (existingPieceAtLeft && existingPieceAtLeft.isWhite !== isWhite) {
    addToPossibleMoves(capturablePieces, fileIndex - 1, rankIndex);
  }

  const existingPieceAtRight = control?.getPiecesOnSquare(
    fileIndex + 1,
    rankIndex
  );
  if (existingPieceAtRight && existingPieceAtRight.isWhite !== isWhite) {
    addToPossibleMoves(capturablePieces, fileIndex + 1, rankIndex);
  }

  const existingPiece = control?.getPiecesOnSquare(fileIndex, rankIndex);

  if (!existingPiece) {
    addToPossibleMoves(possibleMoves, fileIndex, rankIndex);
    return true;
  }

  return false;
}

/**
 * Returns whether rank index should be incremented or decremented based on the color of the piece.
 *
 * @param isWhite
 *
 * @returns 1 if white, -1 if black
 */
export function getRankIndexIncrement(isWhite: boolean) {
  return isWhite ? 1 : -1;
}
