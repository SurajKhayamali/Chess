/**
 * Adds a move to the possible moves array if it is within the bounds of the board.
 *
 * @param {number[][]} possibleMoves
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @returns
 */
function addToPossibleMoves(possibleMoves, fileIndex, rankIndex) {
  if (fileIndex < 0 || fileIndex > 7 || rankIndex < 0 || rankIndex > 7) return;

  possibleMoves.push([fileIndex, rankIndex]);
}
