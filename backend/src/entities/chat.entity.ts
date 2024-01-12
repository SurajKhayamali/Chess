import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity()
export class Chat extends BaseEntity {
  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User, { nullable: true })
  receiver?: User; // nullable for game chat

  @ManyToOne(() => Game, { nullable: true })
  game?: Game; // nullable for private chat between two users

  @Column()
  message: string;
}
