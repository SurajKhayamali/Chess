const RANKS = ["a", "b", "c", "d", "e", "f", "g", "h"]; // vertical columns of squares
const FILES = ["1", "2", "3", "4", "5", "6", "7", "8"]; // horizontal rows of squares
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

export const INITIAL_BOARD = [
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];
