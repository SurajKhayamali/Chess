import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { GameMode } from '../enums/gameMode.enum';

@Entity()
export class Game extends BaseEntity {
  @Column()
  slug: string;

  @ManyToOne(() => User, { nullable: true })
  whitePlayer?: User;

  @ManyToOne(() => User, { nullable: true })
  blackPlayer?: User;

  @Column({
    type: 'enum',
    enum: GameMode,
    default: GameMode.PLAYER_VS_PLAYER,
  })
  gameMode: GameMode = GameMode.PLAYER_VS_PLAYER;

  @Column({ nullable: true })
  timeLimit?: number; // in seconds

  @Column()
  initialBoardState: string; // FEN notation

  @Column()
  isGameOver: boolean = false;

  @Column({ nullable: true })
  hasWhitePlayerWon?: boolean;
}
