import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity('chats')
export class Chat extends BaseEntity {
  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  sender: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  receiver?: User; // nullable for game chat

  @ManyToOne(() => Game, { nullable: true, onDelete: 'SET NULL' })
  game?: Game; // nullable for private chat between two users

  @Column()
  message: string;
}
