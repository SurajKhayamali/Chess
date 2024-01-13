import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Game } from './game.entity';
import { PieceType } from '../enums/pieceType.enum';

@Entity('moves')
export class Move extends BaseEntity {
  @ManyToOne(() => Game, {
    onDelete: 'CASCADE',
  })
  game: Game;

  @Column({
    type: 'enum',
    enum: PieceType,
  })
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

  @Column({ nullable: true })
  capturedPieceType?: PieceType; // nullable for non-capturing moves
}
