import { Piece } from 'components/pieces';
import { GameMode, SquareColor } from 'enums/game.enum';
import { User } from './user.interface';
import { Square } from 'chess.js';

export type SquareColorType = SquareColor.LIGHT | SquareColor.DARK;

export interface ValidMove {
  piece: Piece;
  fileIndex: number;
  rankIndex: number;
}

export type Move = number[];
export type Moves = Move[];

export interface Game {
  id: number;
  slug: string;
  whitePlayer?: User;
  blackPlayer?: User;
  mode: GameMode;
  timeLimit?: number;
  pgn: string; // Portable Game Notation
  isOver?: boolean;
  hasWhitePlayerWon?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeVariant {
  title: string;
  description?: string;
  value?: number;
}

export interface RecordMoveDto {
  from: Square;
  to: Square;
}
