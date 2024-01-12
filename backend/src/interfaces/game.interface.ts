import { Game } from '../entities/game.entity';
import { BaseColumnsToOmit } from './base.interface';

export interface CreateGameDto extends Omit<Game, BaseColumnsToOmit> {}

export interface UpdateGameDto extends Partial<CreateGameDto> {}
