import {
  DEBUG,
  FILES,
  MAX_INDEX,
  MIN_INDEX,
  RANKS,
} from './constants/game.constant';
import { SquareColor } from './enums/game.enum';
import { SquareColorType } from './interfaces/game.interface';

/**
 * Returns if the index is out of bounds.
 *
 * @param index The index to check.
 *
 * @returns Whether the index is out of bounds.
 */
export function checkIndexOutOfBounds(index: number) {
  return index < MIN_INDEX || index > MAX_INDEX;
}

/**
 * Returns if the file index is out of bounds.
 *
 * @param fileIndex The file index to check.
 *
 * @returns Whether the file index is out of bounds.
 */
export function checkFileIndexOutOfBounds(fileIndex: number): boolean {
  return checkIndexOutOfBounds(fileIndex);
}

/**
 * Returns if the rank index is out of bounds.
 *
 * @param rankIndex The rank index to check.
 *
 * @returns Whether the rank index is out of bounds.
 */
export function checkRankIndexOutOfBounds(rankIndex: number): boolean {
  return checkIndexOutOfBounds(rankIndex);
}

/**
 * Validates if the file index is out of bounds.
 *
 * @param fileIndex The file index to check.
 *
 * @throws {Error} If the file index is out of bounds.
 */
export function validateFileIndexOutOfBounds(fileIndex: number) {
  if (checkFileIndexOutOfBounds(fileIndex)) {
    throw new Error('File index out of bounds');
  }
}

/**
 * Validates if the rank index is out of bounds.
 *
 * @param rankIndex The rank index to check.
 *
 * @throws {Error} If the rank index is out of bounds.
 */
export function validateRankIndexOutOfBounds(rankIndex: number) {
  if (checkRankIndexOutOfBounds(rankIndex)) {
    throw new Error('Rank index out of bounds');
  }
}

/**
 * Returns the color of a square.
 *
 * @param fileIndex The file index of the square.
 * @param rankIndex The rank index of the square.
 *
 * @returns The color of the square.
 *
 * @example getSquareColor(0, 0) // "dark", bottom left-most
 */
export function getSquareColor(
  fileIndex: number,
  rankIndex: number
): SquareColorType {
  return (fileIndex + rankIndex) % 2 == 0
    ? SquareColor.DARK
    : SquareColor.LIGHT;
}

/**
 * Returns the id of a square.
 *
 * @param fileIndex The file index of the square.
 * @param rankIndex The rank index of the square.
 *
 * @returns The id of the square.
 * @throws {Error} If the file or rank index is out of bounds.
 */
export function getSquareId(fileIndex: number, rankIndex: number): string {
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
 * @param color1 The first color.
 * @param color2 The second color.
 *
 * @returns {boolean} Whether the colors are the same.
 */
export function checkIfSameColor(color1: boolean, color2: boolean): boolean {
  return color1 === color2;
}

/**
 * Logs to the console if the debug flag is set.
 * @param args The arguments to log.
 */
export function log(...args: unknown[]) {
  if (!DEBUG) return;

  console.log(...args);
}
