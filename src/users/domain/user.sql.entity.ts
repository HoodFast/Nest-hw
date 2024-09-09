import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { EmailConfirmation } from './email.confirmation.entity';

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
