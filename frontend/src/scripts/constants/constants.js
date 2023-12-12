export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"]; // horizontal rows of squares
export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"]; // vertical columns of squares
export const FILES_LENGTH = FILES.length;
export const RANKS_LENGTH = RANKS.length;

export const MIN_INDEX = 0;
export const MAX_INDEX = 7;

export const PIECES = {
  PAWN: "Pawn",
  KNIGHT: "Knight",
  BISHOP: "Bishop",
  ROOK: "Rook",
  QUEEN: "Queen",
  KING: "King",
};

export const BOARD_ID = "board";

export const HIGHLIGHT_MODIFIERS = {
  SELECTED: "selected",
  VALID: "valid",
  CAPTURABLE: "capturable",
  LAST_MOVE: "last-move",
  HOVER: "hover",
};

export const SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS = [
  HIGHLIGHT_MODIFIERS.SELECTED,
  HIGHLIGHT_MODIFIERS.VALID,
  HIGHLIGHT_MODIFIERS.CAPTURABLE,
  HIGHLIGHT_MODIFIERS.LAST_MOVE,
  HIGHLIGHT_MODIFIERS.HOVER,
];

export const PIECE_HIGHLIGHT_MODIFIERS = {
  CHECKED: "checked",
};
export const SUPPORTED_PIECE_HIGHLIGHT_MODIFIERS = [
  PIECE_HIGHLIGHT_MODIFIERS.CHECKED,
];

export const DEBUG = true;
