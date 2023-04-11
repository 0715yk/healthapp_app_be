import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: string;

  @Column()
  nickname: string;

  @Column()
  password: string;
}
