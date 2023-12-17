// import { checkIfKingIsInCheck } from "./entities/components/pieces/helpers/kingInCheck.helper";

const POSSIBLE_CASES = [];

// function getPossibleMoves(boardState) {
//   const possibleMoves = [];
//   const capturablePieces = [];

//   for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
//     for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
//       const possibleMoves

function makeMove(boardState, move) {
  const [fileIndex, rankIndex] = move;
  const piece = boardState[fileIndex][rankIndex];
  const capturedPiece = boardState[fileIndex][rankIndex];

  boardState[fileIndex][rankIndex] = piece;
  boardState[fileIndex][rankIndex] = capturedPiece;
}

/**
 * Evaluates the board state.
 *
 * @param {string[][]} boardState
 * @param {number} depth
 */
export function evaluate(boardState, depth) {
  const moves = [];
  // Base case: if depth is 0 or game is over, return
  // if (depth === 0 || isGameOver(boardState)) {
  if (depth === 0) {
    return moves;
  }

  // Recursive case
  for (const move of getPossibleMoves(boardState)) {
    // Make a move
    makeMove(boardState, move);
    // Check if the king is exposed to check
    if (!isKingExposedToCheck(boardState)) {
      // If not, add this move to the list of valid moves
      moves.push(move);
    }
    // Undo the move
    undoMove(boardState, move);
    // Recurse with a smaller depth
    evaluate(boardState, depth - 1);
  }

  return moves;
}

function checkIfKingIsInCheck(state, isWhiteKingToBeChecked) {
  // Find the king to be checked
  const king = state.getPlayersKing(isWhiteKingToBeChecked);
  const oponentKing = state.getPlayersKing(!isWhiteKingToBeChecked);

  // Find all the pieces of the opposite color
  const piecesToCheck = state.getPieces().filter((piece) => {
    if (piece.isWhite === isWhiteKingToBeChecked) return false;
    if (piece.isKing) return false;
    return true;
  });

  for (const piece of piecesToCheck) {
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

function checkIfMoveExposeKingToCheck(
  gameState,
  piece,
  fileIndex,
  rankIndex,
  depth
) {
  // return true;
  // return isInInCheck(gameState, piece, fileIndex, rankIndex, depth);

  // if (depth < 0) return false;
  // if (depth === 0) {
  //   const { isInCheck } = checkIfKingIsInCheck(gameState, piece.isWhite);
  //   return isInCheck;
  // }

  // const capturedPiece = gameState.getPiece(fileIndex, rankIndex);

  // gameState.recordAndMove(piece, fileIndex, rankIndex, capturedPiece);
  const { isInCheck } = checkIfKingIsInCheck(gameState, piece.isWhite);
  // gameState.undoLastMove();
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
  // Base case: if depth is 0 or game is over, return
  // if (depth === 0 || gameState.hasGameEnded) {
  //   return;
  // }
  // const validMoves = [];
  // // Recursive case
  // for (const move of possibleMoves) {
  //   // Make a move
  //   makeMove(state, move);
  //   // Check if the king is exposed to check
  //   if (!isKingExposedToCheck(state, piece)) {
  //     // If not, add this move to the list of valid moves
  //     validMoves.push(move);
  //   }
  //   // Undo the move
  //   undoMove(state, move);
  //   // Recurse with a smaller depth
  //   filterMovesThatExposeKingToCheck(state, piece, possibleMoves, depth - 1);
  // }
  // return validMoves;
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
