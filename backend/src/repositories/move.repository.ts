import { AppDataSource } from '../database/data-source';
import { Move } from '../entities/move.entity';

export const MoveRepository = AppDataSource.getRepository(Move);
