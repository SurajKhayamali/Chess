import { FILES, RANKS } from "./constants";

/**
 * Returns if the file index is out of bounds.
 *
 * @param {number} fileIndex The file index to check.
 *
 * @returns {boolean} Whether the file index is out of bounds.
 */
export function checkFileIndexOutOfBounds(fileIndex) {
  return fileIndex < 0 || fileIndex > 7;
}

/**
 * Returns if the rank index is out of bounds.
 *
 * @param {number} rankIndex The rank index to check.
 *
 * @returns {boolean} Whether the rank index is out of bounds.
 */
export function checkRankIndexOutOfBounds(rankIndex) {
  return rankIndex < 0 || rankIndex > 7;
}

/**
 * Validates if the file index is out of bounds.
 *
 * @param {number} fileIndex The file index to check.
 *
 * @throws {Error} If the file index is out of bounds.
 */
export function validateFileIndexOutOfBounds(fileIndex) {
  if (checkFileIndexOutOfBounds(fileIndex)) {
    throw new Error("File index out of bounds");
  }
}

/**
 * Validates if the rank index is out of bounds.
 *
 * @param {number} rankIndex The rank index to check.
 *
 * @throws {Error} If the rank index is out of bounds.
 */
export function validateRankIndexOutOfBounds(rankIndex) {
  if (checkRankIndexOutOfBounds(rankIndex)) {
    throw new Error("Rank index out of bounds");
  }
}

/**
 * Adds a move to the possible moves array if it is within the bounds of the board.
 *
 * @param {number[][]} possibleMoves
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @returns
 */
export function addToPossibleMoves(possibleMoves, fileIndex, rankIndex) {
  if (
    checkFileIndexOutOfBounds(fileIndex) ||
    checkRankIndexOutOfBounds(rankIndex)
  )
    return;

  possibleMoves.push([fileIndex, rankIndex]);
}

/**
 * Returns the color of a square.
 *
 * @param {number} fileIndex The file index of the square.
 * @param {number} rankIndex The rank index of the square.
 *
 * @returns {"dark" | "light"} The color of the square.
 *
 * @example getSquareColor(0, 0) // "dark", bottom left-most
 */
export function getSquareColor(fileIndex, rankIndex) {
  return (fileIndex + rankIndex) % 2 == 0 ? "dark" : "light";
}

/**
 * Returns the id of a square.
 *
 * @param {number} fileIndex The file index of the square.
 * @param {number} rankIndex The rank index of the square.
 *
 * @returns {string} The id of the square.
 * @throws {Error} If the file or rank index is out of bounds.
 */
export function getSquareId(fileIndex, rankIndex) {
  validateFileIndexOutOfBounds(fileIndex);
  validateRankIndexOutOfBounds(rankIndex);

  const file = FILES[fileIndex];
  if (!file) throw new Error(`File index ${fileIndex} out of bounds`);

  const rank = RANKS[rankIndex];
  if (!rank) throw new Error(`Rank index ${rankIndex} out of bounds`);

  return `${file}${rank}`;
}
