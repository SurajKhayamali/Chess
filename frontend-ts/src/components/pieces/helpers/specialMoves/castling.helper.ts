import { FILES_LENGTH, MIN_INDEX } from 'constants/game.constant';
import { GameState } from 'entities/GameState';
import { Moves } from 'interfaces/game.interface';
import { King } from '../../King';
import { Rook } from '../../Rook';

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
 * @param king
 * @param rook
 */
function isCastlingPossible(king: King, rook: Rook) {
  if (king.hasMoved || rook.hasMoved || king.isInCheck === true) return false;

  const kingFileIndex = king.fileIndex;
  const kingRankIndex = king.rankIndex;
  const rookFileIndex = rook.fileIndex;
  const rookRankIndex = rook.rankIndex;

  if (kingRankIndex !== rookRankIndex) return false;

  if (king.isSquareUnderAttack(kingFileIndex, kingRankIndex)) return false;

  const fileIndexIncrement = kingFileIndex < rookFileIndex ? 1 : -1;
  for (
    let fileIndex = kingFileIndex + fileIndexIncrement;
    fileIndex !== rookFileIndex;
    fileIndex += fileIndexIncrement
  ) {
    if (king.isSquareOccupiedOrUnderAttack(fileIndex, kingRankIndex))
      return false;
  }

  return true;
}

/**
 * Returns the moves if castling is possible with the rook on the either side of the king.
 *
 * @param state
 * @param king
 *
 * @returns {number[][]} possibleMoves
 */
export function getCastlingMovesIfPossible(state: GameState, king: King) {
  const possibleMoves: Moves = [];
  if (king.hasMoved) return possibleMoves;

  const rooks = state
    .getPiecesOfName('Rook', king.isWhite)
    .filter((rook) => !rook.hasMoved);

  for (const rook of rooks) {
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

/**
 * Handles the castling move.
 *
 * @param state
 * @param king
 * @param fileIndex
 * @param rankIndex
 */
export function handleCastlingMove(
  state: GameState,
  king: King,
  fileIndex: number,
  rankIndex: number
) {
  const kingFileIndexOffset = fileIndex - king.fileIndex;

  const rookFileIndex = kingFileIndexOffset < 0 ? MIN_INDEX : FILES_LENGTH - 1;
  const rookFileOffset = kingFileIndexOffset < 0 ? 1 : -1;

  const rook = state.getPiece(rookFileIndex, rankIndex);

  if (
    !rook ||
    !isCastlingPossible(king, rook) ||
    Math.abs(kingFileIndexOffset) !== 2
  )
    return;

  state.movePiece(rook, fileIndex + rookFileOffset, rankIndex);
}
