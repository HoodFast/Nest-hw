import { BaseEntity, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Users } from './user.sql.entity';

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
