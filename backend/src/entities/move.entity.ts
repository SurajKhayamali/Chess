import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Game } from './game.entity';
import { PieceType } from '../enums/pieceType.enum';

@Entity()
export class Move extends BaseEntity {
  @ManyToOne(() => Game)
  game: Game;

  @Column()
  pieceType: PieceType;

  @Column()
  isWhite: boolean;

  @Column()
  oldFileIndex: number;

  @Column()
  oldRankIndex: number;

  @Column()
  newFileIndex: number;

  @Column()
  newRankIndex: number;
}
