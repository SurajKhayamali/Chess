import { addToPossibleMoves } from "../../../../utils";

/**
 * Adds a move to the possible moves array if it is within the bounds of the board.
 * Also adds the move to the capturable moves array if there is an oponent's piece on the square.
 *
 * @param {GameControl} control
 * @param {number[][]} possibleMoves
 * @param {number[][]} capturablePieces
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @param {boolean} isWhite
 *
 * @returns {boolean} - true if should continue, false if should break
 */
export function addToPossibleAndCapturableMoves(
  control,
  possibleMoves,
  capturablePieces,
  fileIndex,
  rankIndex,
  isWhite
) {
  const existingPiece = control.getPiecesOnSquare(fileIndex, rankIndex);

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
 * @param {GameControl} control
 * @param {number[][]} possibleMoves
 * @param {number[][]} capturablePieces
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @param {boolean} isWhite
 *
 * @returns {boolean} - true if should continue, false if should break
 */
export function addToPossibleAndCapturableMovesForPawn(
  control,
  possibleMoves,
  capturablePieces,
  fileIndex,
  rankIndex,
  isWhite
) {
  const existingPieceAtLeft = control.getPiecesOnSquare(
    fileIndex - 1,
    rankIndex
  );
  if (existingPieceAtLeft && existingPieceAtLeft.isWhite !== isWhite) {
    addToPossibleMoves(capturablePieces, fileIndex - 1, rankIndex);
  }

  const existingPieceAtRight = control.getPiecesOnSquare(
    fileIndex + 1,
    rankIndex
  );
  if (existingPieceAtRight && existingPieceAtRight.isWhite !== isWhite) {
    addToPossibleMoves(capturablePieces, fileIndex + 1, rankIndex);
  }

  const existingPiece = control.getPiecesOnSquare(fileIndex, rankIndex);

  if (!existingPiece) {
    addToPossibleMoves(possibleMoves, fileIndex, rankIndex);
    return true;
  }

  return false;
}

/**
 * Returns whether rank index should be incremented or decremented based on the color of the piece.
 *
 * @param {boolean} isWhite
 *
 * @returns {number} 1 if white, -1 if black
 */
export function getRankIndexIncrement(isWhite) {
  return isWhite ? 1 : -1;
}
