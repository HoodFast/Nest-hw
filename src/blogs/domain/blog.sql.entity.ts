import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Users extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ length: 10, collation: 'C' })
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: Date;
  @Column({ nullable: true })
  isMembership: boolean;
}
