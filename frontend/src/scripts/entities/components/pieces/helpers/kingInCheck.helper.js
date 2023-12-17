import { GameState } from "../../../GameState";
import { King } from "../King";
import { Piece } from "../Piece";

/**
 * Checks if the king is in check.
 *
 * @param {GameState} state The game state.
 * @param {boolean} isWhiteKingToBeChecked Whether the white king is to be checked.
 *
 * @returns {{isInCheck: boolean, oponentsKing: King, checkBy: Piece?}} Whether the king is in check and the king piece.
 */
export function checkIfKingIsInCheck(state, isWhiteKingToBeChecked) {
  // Find the king to be checked
  const king = state.getPlayersKing(isWhiteKingToBeChecked);
  const oponentKing = state.getPlayersKing(!isWhiteKingToBeChecked);

  // Find all the pieces of the opposite color
  const oponentsPieces = state.getPieces().filter((piece) => {
    const isSameColor = piece.isWhite === isWhiteKingToBeChecked;
    if (isSameColor) return false;

    if (piece instanceof King) return false;

    return true;
  });
  console.log("oponentsPieces:", oponentsPieces);
  // debugger;

  for (const piece of oponentsPieces) {
    if (
      piece.canAttackOponentKing(oponentKing.fileIndex, oponentKing.rankIndex)
    ) {
      king.updateIsInCheck(true);
      return { isInCheck: true, king, checkBy: piece };
    }
  }

  king.updateIsInCheck(false);
  return { isInCheck: false, king, checkBy: null };
}
