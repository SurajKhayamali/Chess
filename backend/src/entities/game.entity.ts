import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { GameMode } from '../enums/gameMode.enum';

@Entity('games')
export class Game extends BaseEntity {
  @Column({
    unique: true,
  })
  slug: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  whitePlayer?: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  blackPlayer?: User;

  @Column({
    type: 'enum',
    enum: GameMode,
    default: GameMode.PLAYER_VS_PLAYER,
  })
  mode: GameMode = GameMode.PLAYER_VS_PLAYER;

  @Column({ nullable: true })
  timeLimit?: number; // in seconds

  @Column()
  pgn?: string = ''; // Portable Game Notation

  @Column()
  isOver?: boolean = false;

  @Column({ nullable: true })
  hasWhitePlayerWon?: boolean;
}
