import {
  DEBUG,
  FILES,
  MAX_INDEX,
  MIN_INDEX,
  RANKS,
} from "./constants/constants";

/**
 * Returns if the index is out of bounds.
 *
 * @param {number} index The index to check.
 *
 * @returns {boolean} Whether the index is out of bounds.
 */
export function checkIndexOutOfBounds(index) {
  return index < MIN_INDEX || index > MAX_INDEX;
}

/**
 * Returns if the file index is out of bounds.
 *
 * @param {number} fileIndex The file index to check.
 *
 * @returns {boolean} Whether the file index is out of bounds.
 */
export function checkFileIndexOutOfBounds(fileIndex) {
  return checkIndexOutOfBounds(fileIndex);
}

/**
 * Returns if the rank index is out of bounds.
 *
 * @param {number} rankIndex The rank index to check.
 *
 * @returns {boolean} Whether the rank index is out of bounds.
 */
export function checkRankIndexOutOfBounds(rankIndex) {
  return checkIndexOutOfBounds(rankIndex);
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

/**
 * Returns if both the colors are the same.
 *
 * @param {any} color1 The first color.
 * @param {any} color2 The second color.
 *
 * @returns {boolean} Whether the colors are the same.
 */
export function checkIfSameColor(color1, color2) {
  return color1 === color2;
}

/**
 * Logs to the console if the debug flag is set.
 * @param  {...any} args The arguments to log.
 */
export function log(...args) {
  if (!DEBUG) return;

  console.log(...args);
}
