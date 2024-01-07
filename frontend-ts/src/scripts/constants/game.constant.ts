import {
  SquareHighlightModifiers,
  PieceHighlightModifiers,
} from '../enums/game.enum';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // horizontal rows of squares
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8']; // vertical columns of squares
export const FILES_LENGTH = FILES.length;
export const RANKS_LENGTH = RANKS.length;

export const MIN_INDEX = 0;
export const MAX_INDEX = 7;

export const BOARD_ID = 'board';
export const DEFAULT_FEN_STRING =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // Initial board state

export const SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS = [
  SquareHighlightModifiers.SELECTED,
  SquareHighlightModifiers.VALID,
  SquareHighlightModifiers.CAPTURABLE,
  SquareHighlightModifiers.LAST_MOVE,
  SquareHighlightModifiers.HOVER,
];

export const SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS = [
  PieceHighlightModifiers.CHECKED,
];

export const AI_THINKING_TIME = 1 * 1000; // 1 second, in milliseconds

export const DEBUG = false;
