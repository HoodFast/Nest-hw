import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  _passwordHash: string;
  @Column({ length: 10, collation: 'C' })
  login: string;
  @Column()
  email: string;
  @Column()
  createdAt: Date;
  @Column({ nullable: true })
  recoveryCode: string;
}

@Entity()
export class EmailConfirmation {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  confirmationCode: string;
  @Column('date')
  expirationDate: string;
  @Column('boolean')
  isConfirmed: boolean;
  @Column()
  @OneToOne((type) => Users, (Users) => Users.id)
  userId: string;
}
