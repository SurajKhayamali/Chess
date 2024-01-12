import { AppDataSource } from '../database/data-source';
import { Game } from '../entities/game.entity';

export const GameRepository = AppDataSource.getRepository(Game);
