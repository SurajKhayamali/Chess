import { GameState } from "./entities/GameState";

/**
 * Returns a random move for the player.
 *
 * @param {GameState} gameState The game state.
 * @param {boolean} isWhite Whether the player is white.
 * @returns
 */
export function getRandomMove(gameState, isWhite) {
  const moves = gameState.getValidMoves(isWhite);
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move;
}
