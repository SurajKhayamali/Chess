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
 *
 * @returns {boolean} - true if should continue, false if should break
 */
export function addToPossibleAndCapturableMoves(
  control,
  possibleMoves,
  capturablePieces,
  fileIndex,
  rankIndex
) {
  const existingPiece = control.getPiecesOnSquare(fileIndex, rankIndex);

  // If there is a piece on the square
  if (!existingPiece) {
    addToPossibleMoves(possibleMoves, fileIndex, rankIndex);
    return true;
  }

  // If it is different color, add to capturable pieces
  if (existingPiece.isWhite !== this.isWhite)
    addToPossibleMoves(capturablePieces, fileIndex, rankIndex);

  return false;
}
