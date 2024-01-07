import { Piece } from '../components/pieces';
import { SquareColor } from '../enums/game.enum';

export type SquareColorType = SquareColor.LIGHT | SquareColor.DARK;

export interface ValidMove {
  piece: Piece;
  fileIndex: number;
  rankIndex: number;
}

export type Move = number[];
export type Moves = Move[];
