import { AppDataSource } from '../database/data-source';
import { User } from '../entities/user.entity';

export const UserRepository = AppDataSource.getRepository(User);
