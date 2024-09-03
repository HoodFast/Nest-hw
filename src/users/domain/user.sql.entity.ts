import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn()
  id: string;
  @Column()
  _passwordHash: string;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  createdAt: Date;
  @Column()
  recoveryCode: string;
}
