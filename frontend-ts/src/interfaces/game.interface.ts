import { Piece } from 'components/pieces';
import { GameMode, SquareColor } from 'enums/game.enum';

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
  whitePlayer?: number;
  blackPlayer?: number;
  mode: GameMode;
  timeLimit?: number;
  initialBoardState: string; // FEN notation
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
