import { GameState } from "../../../../GameState";
import { Pawn } from "../../Pawn";

/**
 * Handles pawn promotion.
 *
 * @param {GameState} state
 * @param {Pawn} pawn
 * @param {string} pieceType
 *
 * @returns {boolean} Whether the pawn was promoted.
 */
export function handlePawnPromotion(state, pawn, pieceType) {
  const { fileIndex, rankIndex } = pawn;

  try {
    const newPiece = pawn.promoteTo(pieceType);

    state.replacePieceAtSquare(newPiece, fileIndex, rankIndex);

    return true;
  } catch (error) {
    return false;
  }
}
