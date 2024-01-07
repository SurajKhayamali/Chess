import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column({
    nullable: true,
  })
  middleName?: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;
}
