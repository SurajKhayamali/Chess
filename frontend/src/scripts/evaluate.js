// import { checkIfKingIsInCheck } from "./entities/components/pieces/helpers/kingInCheck.helper";

const POSSIBLE_CASES = [];

export function evaluate(gameState) {}

function reEvaluateMovesAndFilterIfExposeKingToCheck(gameState) {
  const pieces = gameState.getPieces();
  for (const piece of pieces) {
    piece.reEvaluateMovesAndFilterIfExposeKingToCheck();
  }
}

function checkIfKingIsInCheck(state, isWhiteKingToBeChecked) {
  // reEvaluateMovesAndFilterIfExposeKingToCheck(state);

  // Find the king to be checked
  const king = state.getPlayersKing(isWhiteKingToBeChecked);

  // Find all the pieces of the opposite color
  const piecesToCheck = state.getPieces().filter((piece) => {
    if (piece.isWhite === isWhiteKingToBeChecked) return false;
    if (piece.isKing) return false;
    return true;
  });

  for (const piece of piecesToCheck) {
    if (piece.canAttackOponentKing) {
      king.updateIsInCheck(true);
      return { isInCheck: true, king, checkBy: piece };
    }
  }

  king.updateIsInCheck(false);
  return { isInCheck: false, king, checkBy: null };
}

function checkIfMoveExposeKingToCheck(
  gameState,
  piece,
  fileIndex,
  rankIndex,
  depth
) {
  // return true;
  if (depth < 0) return false;
  if (depth === 0) {
    const { isInCheck } = checkIfKingIsInCheck(gameState, piece.isWhite);
    return isInCheck;
  }

  const capturedPiece = gameState.getPiece(fileIndex, rankIndex);

  gameState.recordAndMove(piece, fileIndex, rankIndex, capturedPiece);
  const { isInCheck } = checkIfKingIsInCheck(gameState, piece.isWhite);
  gameState.undoLastMove();
  return isInCheck;
  //   return true;
}

export function filterMovesThatExposeKingToCheck(
  gameState,
  piece,
  possibleMoves,
  depth
) {
  return possibleMoves.filter(([fileIndex, rankIndex]) => {
    return !checkIfMoveExposeKingToCheck(
      gameState,
      piece,
      fileIndex,
      rankIndex,
      depth
    );
  });
}

// export function checkIfMoveBlocksOrEscapesKingFromCheck(
//   gameState,
//   piece,
//   fileIndex,
//   rankIndex
// ) {}

// export function checkIfMoveShouldBeAllowed(
//   gameState,
//   piece,
//   fileIndex,
//   rankIndex
// ) {
//   // Check if move exposes king to check
//   // Check if move blocks or escapes king from check
//   // Check if move should be allowed

//   return (
//     !checkIfMoveExposeKingToCheck(gameState, piece, fileIndex, rankIndex) &&
//     !checkIfMoveBlocksOrEscapesKingFromCheck(
//       gameState,
//       piece,
//       fileIndex,
//       rankIndex
//     )
//   );
// }
