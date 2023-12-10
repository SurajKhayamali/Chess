export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"]; // horizontal rows of squares
export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"]; // vertical columns of squares
export const FILES_LENGTH = FILES.length;
export const RANKS_LENGTH = RANKS.length;
const PIECE_NAMES = ["Pawn", "Knight", "Bishop", "Rook", "Queen", "King"];
const PIECE_ABBREVIATIONS = ["P", "N", "B", "R", "Q", "K"];
const PIECE_COLORS = ["White", "Black"];
const PIECE_COLORS_ABBREVIATIONS = ["w", "b"];
const PIECE_COLORS_HEX = ["#FFFFFF", "#000000"];

const REPRESENTATION = {
  P: "Pawn",
  N: "Knight",
  B: "Bishop",
  R: "Rook",
  Q: "Queen",
  K: "King",
  null: "Empty",
};

const INITIAL_BOARD = [
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

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

export const PIECE_HIGHILIGHT_MODIFIERS = {
  CHECKED: "checked",
};
export const SUPPORTED_PIECE_HIGHILIGHT_MODIFIERS = [
  PIECE_HIGHILIGHT_MODIFIERS.CHECKED,
];

