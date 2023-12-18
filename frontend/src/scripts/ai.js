import { GameState } from "./entities/GameState";
import { Piece } from "./entities/components/pieces";
import { checkIfSameColor } from "./utils";

export const AI_TYPES = {
  RANDOM: "random", // randomly selects a move from all possible moves
  GREEDY: "greedy", // selects a move that captures a piece, if possible
  GENEROUS: "generous", // selects a move that moves a piece without capturing, if possible
  MINIMAX: "minimax", // TODO: Not implemented yet, default to random
  ALPHA_BETA: "alphaBeta", // TODO: Not implemented yet, default to random
};

export const SELECTABLE_AI_TYPES = [
  AI_TYPES.RANDOM,
  AI_TYPES.GREEDY,
  AI_TYPES.GENEROUS,
];

export const DEFAULT_AI_TYPE = AI_TYPES.GREEDY;

/**
 * Returns all the pieces for the player.
 *
 * @param {GameState} gameState The game state.
 * @param {boolean} isWhite Whether the player is white.
 */
function getPieces(gameState, isWhite) {
  return gameState
    .getPieces()
    .filter((piece) => checkIfSameColor(piece.isWhite, isWhite));
}

/**
 * Adapt the move to the ValidMove type.
 *
 * @param {Piece} piece The piece.
 * @param {number[]} move The move.
 *
 * @returns {import("./entities/GameState").ValidMove} The valid move.
 */
function adaptMoveForAi(piece, move) {
  return {
    piece,
    fileIndex: move[0],
    rankIndex: move[1],
  };
}

/**
 * Adapts all the possible or capturable moves to the ValidMove type.
 *
 * @param {Piece} piece The piece.
 * @param {number[][]} possibleMoves The possible moves.
 *
 * @returns {import("./entities/GameState").ValidMove[]} The valid moves.
 */
function adaptPossibleMovesForAi(piece, possibleMoves) {
  return possibleMoves.map((move) => adaptMoveForAi(piece, move));
}

/**
 * Returns a array of all the possible moves for the player.
 *
 * @param {GameState} gameState The game state.
 * @param {boolean} isWhite Whether the player is white.
 *
 * @returns {import("./entities/GameState").ValidMove[]} The valid moves.
 */
function getMovesForRandom(gameState, isWhite) {
  const pieces = getPieces(gameState, isWhite);
  const moves = [];
  for (const piece of pieces) {
    const { possibleMoves, capturablePieces } = piece.possibleMoves;
    moves.push(...adaptPossibleMovesForAi(piece, possibleMoves));
    moves.push(...adaptPossibleMovesForAi(piece, capturablePieces));
  }

  return moves;
}

/**
 * Returns a array of all the capturable moves for the player. if there are none, returns all the possible moves.
 *
 * @param {GameState} gameState The game state.
 * @param {boolean} isWhite Whether the player is white.
 *
 * @returns {import("./entities/GameState").ValidMove[]} The valid moves.
 */
function getMovesForGreedy(gameState, isWhite) {
  const pieces = getPieces(gameState, isWhite);
  const moves = [];
  for (const piece of pieces) {
    const { capturablePieces } = piece.possibleMoves;
    moves.push(...adaptPossibleMovesForAi(piece, capturablePieces));
  }

  if (!moves.length) {
    for (const piece of pieces) {
      const { possibleMoves } = piece.possibleMoves;
      moves.push(...adaptPossibleMovesForAi(piece, possibleMoves));
    }
  }

  return moves;
}

/**
 * Returns a array of all the possible moves for the player. if there are none, returns all the capturable moves.
 *
 * @param {GameState} gameState The game state.
 * @param {boolean} isWhite Whether the player is white.
 *
 * @returns {import("./entities/GameState").ValidMove[]} The valid moves.
 */
function getMovesForGenerous(gameState, isWhite) {
  const pieces = getPieces(gameState, isWhite);
  const moves = [];
  for (const piece of pieces) {
    const { possibleMoves } = piece.possibleMoves;
    moves.push(...adaptPossibleMovesForAi(piece, possibleMoves));
  }

  if (!moves.length) {
    for (const piece of pieces) {
      const { capturablePieces } = piece.possibleMoves;
      moves.push(...adaptPossibleMovesForAi(piece, capturablePieces));
    }
  }

  return moves;
}

// TODO: Not implemented yet, default to random
function getMovesForMinimax(gameState, isWhite) {
  return getRandomMove(gameState, isWhite);
}

// TODO: Not implemented yet, default to random
function getMovesForAlphaBeta(gameState, isWhite) {
  return getRandomMove(gameState, isWhite);
}

/**
 * Returns the moves for the player based on the AI type.
 *
 * @param {GameState} gameState The game state.
 * @param {boolean} isWhite Whether the player is white.
 * @param {string} aiType The AI type.
 *
 * @returns {import("./entities/GameState").ValidMove[]}
 */
function getMovesBasedOnAiType(gameState, isWhite, aiType) {
  switch (aiType) {
    case AI_TYPES.RANDOM:
      return getMovesForRandom(gameState, isWhite);
    case AI_TYPES.GREEDY:
      return getMovesForGreedy(gameState, isWhite);
    case AI_TYPES.GENEROUS:
      return getMovesForGenerous(gameState, isWhite);
    case AI_TYPES.MINIMAX:
      return getMovesForMinimax(gameState, isWhite);
    case AI_TYPES.ALPHA_BETA:
      return getMovesForAlphaBeta(gameState, isWhite);
    default:
      throw new Error(`Invalid AI type: ${aiType}`);
  }
}

/**
 * Returns a random move for the player.
 *
 * @param {GameState} gameState The game state.
 * @param {boolean} isWhite Whether the player is white.
 * @param {string} aiType The AI type.
 *
 * @returns {import("./entities/GameState").ValidMove}
 */
export function getMoveBasedOnAiType(gameState, isWhite, aiType) {
  const moves = getMovesBasedOnAiType(gameState, isWhite, aiType);
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move;
}
