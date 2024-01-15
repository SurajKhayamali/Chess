import { TimeVariant } from 'interfaces/game.interface';
import {
  SquareHighlightModifiers,
  PieceHighlightModifiers,
} from '../enums/game.enum';
import { PieceSymbol } from 'chess.js';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // horizontal rows of squares
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8']; // vertical columns of squares
export const FILES_LENGTH = FILES.length;
export const RANKS_LENGTH = RANKS.length;

export const MIN_INDEX = 0;
export const MAX_INDEX = 7;

export const ABBREVIATION_TO_PIECE = {
  k: 'King',
  q: 'Queen',
  r: 'Rook',
  b: 'Bishop',
  n: 'Knight',
  p: 'Pawn',
};

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

export const TIME_VARIANTS: TimeVariant[] = [
  {
    title: '1 + 0',
    description: 'Bullet',
    value: 60,
  },
  {
    title: '3 + 0',
    description: 'Blitz',
    value: 180,
  },
  {
    title: '5 + 0',
    description: 'Blitz',
    value: 300,
  },
  {
    title: '10 + 0',
    description: 'Rapid',
    value: 600,
  },
  {
    title: '30 + 0',
    description: 'Classical',
    value: 1800,
  },
  {
    title: 'No Time Limit',
    description: 'Casual',
    value: 0,
  },
];

export const AUTO_PROMOTE_PIECE_TO = 'q' as PieceSymbol;
