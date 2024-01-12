import { Move } from '../entities/move.entity';
import { BaseColumnsToOmit } from './base.interface';

export interface CreateMoveDto extends Omit<Move, BaseColumnsToOmit> {}

export interface UpdateMoveDto extends Partial<CreateMoveDto> {}
