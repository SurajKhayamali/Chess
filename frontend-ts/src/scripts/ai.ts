import { GameState } from 'entities/GameState';
import { Piece } from 'components/pieces';
import { checkIfSameColor } from 'scripts/utils';
import { ValidMove } from 'interfaces/game.interface';

export enum AI_TYPE {
  RANDOM = 'random', // randomly selects a move from all possible moves
  GREEDY = 'greedy', // selects a move that captures a piece, if possible
  GENEROUS = 'generous', // selects a move that moves a piece without capturing, if possible
  MINIMAX = 'minimax', // TODO: Not implemented yet, default to random
  ALPHA_BETA = 'alphaBeta', // TODO: Not implemented yet, default to random
}

export const SELECTABLE_AI_TYPES = [
  AI_TYPE.RANDOM,
  AI_TYPE.GREEDY,
  AI_TYPE.GENEROUS,
];

export const DEFAULT_AI_TYPE = AI_TYPE.GREEDY;

/**
 * Returns all the pieces for the player.
 *
 * @param gameState The game state.
 * @param isWhite Whether the player is white.
 */
function getPieces(gameState: GameState, isWhite: boolean) {
  return gameState
    .getPieces()
    .filter((piece) => checkIfSameColor(piece.isWhite, isWhite));
}

/**
 * Adapt the move to the ValidMove type.
 *
 * @param piece The piece.
 * @param move The move.
 */
function adaptMoveForAi(piece: Piece, move: number[]): ValidMove {
  return {
    piece,
    fileIndex: move[0],
    rankIndex: move[1],
  };
}

/**
 * Adapts all the possible or capturable moves to the ValidMove type.
 *
 * @param piece The piece.
 * @param possibleMoves The possible moves.
 */
function adaptPossibleMovesForAi(
  piece: Piece,
  possibleMoves: number[][]
): ValidMove[] {
  return possibleMoves.map((move) => adaptMoveForAi(piece, move));
}

/**
 * Returns a array of all the possible moves for the player.
 *
 * @param gameState The game state.
 * @param isWhite Whether the player is white.
 */
function getMovesForRandom(gameState: GameState, isWhite: boolean) {
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
 * @param gameState The game state.
 * @param isWhite Whether the player is white.
 */
function getMovesForGreedy(gameState: GameState, isWhite: boolean) {
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
 * @param gameState The game state.
 * @param isWhite Whether the player is white.
 */
function getMovesForGenerous(gameState: GameState, isWhite: boolean) {
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
function getMovesForMinimax(gameState: GameState, isWhite: boolean) {
  return getMovesForRandom(gameState, isWhite);
}

// TODO: Not implemented yet, default to random
function getMovesForAlphaBeta(gameState: GameState, isWhite: boolean) {
  return getMovesForRandom(gameState, isWhite);
}

/**
 * Returns the moves for the player based on the AI type.
 *
 * @param gameState The game state.
 * @param isWhite Whether the player is white.
 * @param aiType The AI type.
 *
 */
function getMovesBasedOnAiType(
  gameState: GameState,
  isWhite: boolean,
  aiType: string
): ValidMove[] {
  switch (aiType) {
    case AI_TYPE.RANDOM:
      return getMovesForRandom(gameState, isWhite);
    case AI_TYPE.GREEDY:
      return getMovesForGreedy(gameState, isWhite);
    case AI_TYPE.GENEROUS:
      return getMovesForGenerous(gameState, isWhite);
    case AI_TYPE.MINIMAX:
      return getMovesForMinimax(gameState, isWhite);
    case AI_TYPE.ALPHA_BETA:
      return getMovesForAlphaBeta(gameState, isWhite);
    default:
      throw new Error(`Invalid AI type: ${aiType}`);
  }
}

/**
 * Returns a random move for the player.
 *
 * @param gameState The game state.
 * @param isWhite Whether the player is white.
 * @param aiType The AI type.
 */
export function getMoveBasedOnAiType(
  gameState: GameState,
  isWhite: boolean,
  aiType: AI_TYPE
) {
  const moves = getMovesBasedOnAiType(gameState, isWhite, aiType);
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move;
}
