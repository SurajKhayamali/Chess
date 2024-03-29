import { PieceSymbol, Square } from 'chess.js';
import { Game } from '../entities/game.entity';
import { BaseColumnsToOmit } from './base.interface';

export interface CreateGameDto extends Omit<Game, BaseColumnsToOmit> {}

export interface UpdateGameDto extends Partial<CreateGameDto> {}

export interface JoinGameQueueDto {
  timeLimit: number;
}

export interface LeaveGameQueueDto extends JoinGameQueueDto {}

export interface QueryGameDto {
  slug?: string;
}

export interface RecordMoveDto {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
}
