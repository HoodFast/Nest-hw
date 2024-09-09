import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Users extends BaseEntity {
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
  @OneToOne(
    () => EmailConfirmation,
    (EmailConfirmation) => EmailConfirmation.userId,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  emailConfirmation: EmailConfirmation;
}

@Entity()
export class EmailConfirmation extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  confirmationCode: string;
  @Column('date')
  expirationDate: string;
  @Column('boolean')
  isConfirmed: boolean;
  @Column()
  @OneToOne(() => Users, (Users) => Users.id, { cascade: true })
  userId: string;
}
