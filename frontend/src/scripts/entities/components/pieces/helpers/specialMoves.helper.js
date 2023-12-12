import { GameState } from "../../../GameState";
import { King } from "../King";
import { Rook } from "../Rook";

// Castling
// Castling is a special move in chess, involving the king and either of the original rooks of the same color.
// Castling consists of moving the king two squares towards a rook, then placing the rook on the other side of the king, adjacent to it.
// Castling is only permissible if all of the following conditions hold:
// The king and rook involved in castling must not have previously moved;
// There must be no pieces between the king and the rook;
// The king may not currently be in check, nor may the king pass through or end up in a square that is under attack by an enemy piece (though the rook is permitted to be under attack and to pass over an attacked square);
// The king and the rook must be on the same rank (first row) 0 or 7.

/**
 * Returns whether castling is possible.
 *
 * @param {King} king
 * @param {Rook} rook
 */
export function isCastlingPossible(king, rook) {
  if (king.hasMoved || rook.hasMoved || king.isInCheck === true) return false;

  const kingFileIndex = king.fileIndex;
  const kingRankIndex = king.rankIndex;
  const rookFileIndex = rook.fileIndex;
  const rookRankIndex = rook.rankIndex;

  //   console.log(
  //     "kingFileIndex:",
  //     kingFileIndex,
  //     "kingRankIndex:",
  //     kingRankIndex,
  //     "rookFileIndex:",
  //     rookFileIndex,
  //     "rookRankIndex:",
  //     rookRankIndex,
  //     Math.abs(kingFileIndex - rookFileIndex)
  //   );

  if (kingRankIndex !== rookRankIndex) return false;
  if (Math.abs(kingFileIndex - rookFileIndex) !== 3) return false;

  const fileIndexIncrement = kingFileIndex < rookFileIndex ? 1 : -1;
  //   debugger;
  for (
    let fileIndex = kingFileIndex + fileIndexIncrement;
    fileIndex !== rookFileIndex + fileIndexIncrement;
    fileIndex += fileIndexIncrement
  ) {
    if (king.isSquareUnderAttack(fileIndex, kingRankIndex)) return false;
  }

  return true;
}

/**
 * Returns the moves if castling is possible with the rook on the either side of the king.
 *
 * @param {GameState} state
 * @param {King} king
 * @param {Rook} rook
 *
 * @returns {number[][]} possibleMoves
 */
export function getCastlingMoveIfPossible(state, king) {
  console.log("checking getCastlingMoveIfPossible");
  const possibleMoves = [];
  if (king.hasMoved) return possibleMoves;

  const rooks = state
    .getPiecesOfType("Rook", king.isWhite)
    .filter((rook) => !rook.hasMoved);
  //   console.log("rooks:", rooks);

  for (const rook of rooks) {
    // console.log(
    //   "rook:",
    //   rook,
    //   "king:",
    //   king
    //   //   "isCastlingPossible:",
    //   //   isCastlingPossible(king, rook)
    // );
    if (isCastlingPossible(king, rook)) {
      const kingFileIndex = king.fileIndex;
      const rookFileIndex = rook.fileIndex;
      const fileIndexIncrement = kingFileIndex < rookFileIndex ? 1 : -1;

      possibleMoves.push([
        kingFileIndex + 2 * fileIndexIncrement,
        king.rankIndex,
      ]);
    }
  }

  return possibleMoves;
}
