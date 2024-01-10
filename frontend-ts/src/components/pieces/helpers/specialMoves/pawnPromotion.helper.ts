import { PieceType } from 'enums/game.enum';
import { GameState } from 'entities/GameState';
import { Pawn } from '../../Pawn';

/**
 * Handles pawn promotion.
 *
 * @param state
 * @param pawn
 * @param pieceType
 *
 * @returns {boolean} Whether the pawn was promoted.
 */
export function handlePawnPromotion(
  state: GameState,
  pawn: Pawn,
  pieceType: PieceType
) {
  const { fileIndex, rankIndex } = pawn;

  try {
    const newPiece = pawn.promoteTo(pieceType);

    state.replacePieceAtSquare(newPiece, fileIndex, rankIndex);

    return true;
  } catch (error) {
    return false;
  }
}
